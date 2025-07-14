export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5", // Ücretsiz ve kaliteli model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No reply from model." });
    }
  } catch (err) {
    console.error("🔥 Hata oluştu:", err);
  res.status(500).json({ error: err.message || "Bilinmeyen hata" });
}
}
