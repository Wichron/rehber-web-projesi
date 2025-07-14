export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Sadece POST istekleri destekleniyor" });
  }

  const { prompt } = req.body;
  

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("🧠 OpenAI'den dönen veri:", data);
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
    console.log("⚠️ Cevap alınamadı. OpenAI yanıtı:", data);
    return res.status(200).json({ response: "⚠️ OpenAI'den geçerli bir cevap alınamadı." });
}
    return res.status(200).json({ response: answer });

  } catch (err) {
    console.error("OpenAI API hatası:", err);
    return res.status(500).json({ response: "Sunucu hatası: OpenAI'ye ulaşılamadı." });
  }
}
