// api/groq.js
export default async function handler(req, res) {
  try {
    const { topic } = await req.json ? await req.json() : req.body || {};
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        temperature: 0.4,
        max_tokens: 2048,
        messages: [
          { role: "system", content: "You generate structured JSON roadmaps for learning." },
          { role: "user", content: `Topic: ${topic || "general learning"}` }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
