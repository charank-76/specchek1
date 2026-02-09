export async function POST(req) {
  try {
    // 1️⃣ Read input
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ risks: [] }),
        { status: 200 }
      );
    }
 console.log("KEY EXISTS:", !!process.env.GEMINI_API_KEY);
    // 2️⃣ Prompt (extract exact sentences only)
    const prompt = `
You analyze contract text.

Rules:
- Scan the entire contract
- Pick ONLY exact sentences from the input
- Do NOT rewrite or invent text
- Classify each sentence as:
  - high = serious risk
  - medium = unclear or warning
  - low = good clause
- Do NOT force all levels

Return ONLY JSON.

Format:
{
  "risks": [
    {
      "level": "high|medium|low",
      "text": "exact sentence from input"
    }
  ]
}

TEXT:
${text}
`;

    // 3️⃣ Gemini API call (AI Studio ONLY)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    // 4️⃣ Extract AI text safely
    const output =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      throw new Error("Empty AI response");
    }

    // 5️⃣ Parse JSON safely
    const cleaned = output.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);

    // 6️⃣ Safe fallback (frontend won’t crash)
    return new Response(
      JSON.stringify({
        risks: [
          {
            level: "high",
            text: "Analysis failed. Please try again.",
          },
        ],
      }),
      { status: 200 }
    );
  }
}
