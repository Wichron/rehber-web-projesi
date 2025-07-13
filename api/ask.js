export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }
  
    const { prompt } = req.body;
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await response.json();
  
      const cevap = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";
      res.status(200).json({ response: cevap });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "API isteğinde hata oluştu" });
    }
  }
  