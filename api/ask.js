export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  console.log("API çağrıldı, prompt:", prompt);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini’dan gelen data:", data);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı";
    return res.status(200).json({ response: reply });

  } catch (err) {
    console.error("API isteği sırasında hata:", err);
    return res.status(500).json({ error: "API isteği hatası" });
  }
}
