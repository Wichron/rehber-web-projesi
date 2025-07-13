export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Sadece POST istekleri destekleniyor" });
  }

  const { prompt } = req.body;
  console.log("🟡 Gelen prompt:", prompt);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    console.log("🟢 Gemini yanıtı:", JSON.stringify(data, null, 2));

    // Eğer API'den hata geldiyse
    if (data.error) {
      return res.status(500).json({ response: `❌ Gemini API Hatası: ${data.error.message}` });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(200).json({ response: "⚠️ Yanıt alınamadı (boş içerik)." });
    }

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error("🔥 API erişim hatası:", error);
    return res.status(500).json({ response: "🚨 Sunucu hatası: Gemini'a ulaşamadık." });
  }
}
