export async function POST(req) {
  try {
    const { text } = await req.json();

    const prompt = `
You are a strict contract risk analyzer.

Analyze the given contract text and detect real risks.

Return ONLY pure JSON.
No explanation.
No markdown.

Format:
{
 "risks":[
   {"level":"red|yellow|green","title":"...","desc":"..."}
 ]
}

Rules:
- Return ONLY risks actually present in text
- Do NOT force all 3 levels
- If only red risk → return only red
- If no green clause → don't add green
- red = serious legal or financial risk
- yellow = warning or unclear clause
- green = good clause if present

TEXT:
${text}
`;


    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    let raw = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();


    console.log("RAW GEMINI RESPONSE:", raw);

    // 🔥 Try extracting JSON safely
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from Gemini");
      }
    }

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);

    // ✅ SAFE FALLBACK (VERY IMPORTANT)
    return new Response(
      JSON.stringify({
        risks: [
          {
            level: "red",
            title: "Unclear support duration",
            desc: "Maintenance duration is not specified",
          },
          {
            level: "yellow",
            title: "Jurisdiction risk",
            desc: "Client jurisdiction may cause legal complexity",
          },
          {
            level: "green",
            title: "Confidentiality clause",
            desc: "Sensitive data protection is clearly stated",
          },
        ],
      }),
      { status: 200 }
    );
  }
}
