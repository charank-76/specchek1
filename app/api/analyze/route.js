export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ risks: [] }), { status: 200 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing Gemini API Key");
      throw new Error("API configuration error");
    }

    const prompt = `
      You are a legal contract analyzer.
      Task: Scan the provided text and identify potential risks.
      
      Rules:
      1. Extract ONLY exact sentences from the input.
      2. Classify as: "red" (high risk), "yellow" (medium/unclear), or "green" (low risk/standard).
      3. Do not paraphrase.
      4. Output MUST be valid JSON.
      5. safetySettings

      Format:
      {
        "risks": [
          { "level": "red", "text": "exact sentence here" },
          { "level": "yellow", "text": "exact sentence here" },
          { "level": "green", "text": "exact sentence here" }
        ]
      }

      TEXT:
      ${text}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // This "generationConfig" helps force JSON output
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    const result = await response.json();
    const outputText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) throw new Error("Empty AI response");

    // Clean and Parse
    let parsedData;
    try {
      const cleaned = outputText.replace(/```json|```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON Parse Error:", outputText);
      throw new Error("Invalid AI format");
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return new Response(
      JSON.stringify({
        risks: [{ level: "red", text: "Analysis failed. Please check your connection or try a shorter text." }],
      }),
      { status: 200 }
    );
  }
}