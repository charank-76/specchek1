export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ risks: [] }), { status: 200 });
    }

    // 🔑 PUT KEY HERE
    const apiKey = "";

    const prompt = `
You are a strict contract risk analyzer.

Return ONLY valid JSON.
No explanation. No markdown.

Format:
{
 "risks":[
   {"level":"red|yellow|green","title":"...","desc":"..."}
 ]
}

TEXT:
${text}
`;

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
{
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  }),
}
);


const result = await response.json();
console.log("FULL GEMINI:", result);

// ✅ FIRST create raw
let raw = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

// 🔥 THEN clean markdown
raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

console.log("RAW:", raw);

if (!raw) throw new Error("Empty Gemini response");

let json;
try {
  json = JSON.parse(raw);
} catch {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON");
  json = JSON.parse(match[0]);
}


    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);

    return new Response(
      JSON.stringify({
        risks: [
          {
            level: "red",
            title: "API Error",
            desc: "Gemini not responding correctly",
          },
        ],
      }),
      { status: 200 }
    );
  }
}
