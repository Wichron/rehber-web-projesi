export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("💬 Kullanıcı mesajı:", message);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "microsoft/mai-ds-r1:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    console.log("🌐 API HTTP Durumu:", response.status);
    const data = await response.json();
    console.log("🤖 OpenRouter'dan gelen tam yanıt:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "API isteği başarısız" });
    }

    if (data.choices && data.choices[0]) {
      res.status(200).json({ response: data.choices[0].message.content , reply: data.choices[0].message.content});
    } else {
      res.status(500).json({ error: "No reply from model.", apiResponse: data });
    }
  } catch (err) {
    console.error("🔥 Hata oluştu:", err);
    res.status(500).json({ error: err.message || "Bilinmeyen hata", stack: err.stack });
  }
}
