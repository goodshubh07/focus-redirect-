export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await req.body.json?.() || req.body || {};
    const { topic, prompt } = body;

    if (!topic || !prompt) {
      return res.status(400).json({ error: "Missing topic or prompt" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        temperature: 0.4,
        max_tokens: 2048,
        messages: [
          { role: "system", content: "You generate structured JSON roadmaps for learning. Return ONLY valid JSON matching the structure requested in the prompt, with no extra text." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Groq API error: ${errText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: `Internal server error: ${e.message}` });
  }
}
