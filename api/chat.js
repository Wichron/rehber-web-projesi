export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests allowed" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const services = [
    {
      name: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      model: "deepseek/deepseek-chat-v3-0324:free",
      keys: process.env.OPENROUTER_KEYS?.split(",").map(k => k.trim()),
      headerName: "Authorization",
      prefix: "Bearer ",
    },
    {
      name: "Together",
      endpoint: "https://api.together.xyz/v1/chat/completions",
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      keys: [process.env.TOGETHER_KEY],
      headerName: "Authorization",
      prefix: "Bearer ",
    },
    {
      name: "Groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "meta-llama/llama-3-8b-instruct",
      keys: [process.env.GROQ_KEY],
      headerName: "Authorization",
      prefix: "Bearer ",
    }
  ];

  for (const service of services) {
    for (const key of service.keys || []) {
      try {
        console.log(`🧪 ${service.name} ile deneniyor...`);
        const response = await fetch(service.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [service.headerName]: `${service.prefix}${key}`
          },
          body: JSON.stringify({
            model: service.model,
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: message }
            ],
              stream: false // Akış modunu istemci isteğine göre ayarla
          })
        });
        
        const data = await response.json();
        console.log(`📡 ${service.name} yanıt:`, JSON.stringify(data, null, 2));

        if (response.ok && data.choices?.[0]?.message?.content) {
          return res.status(200).json({ provider: service.name, response: data.choices[0].message.content });
        }

        // 429 veya başka hata: sıradakine geç
        console.warn(`⚠️ ${service.name} başarısız:`, data.error?.message || "Hata");
        

      } catch (err) {
        console.error(`❌ ${service.name} ile istek başarısız:`, err.message);
      }
    }
  }

  res.status(500).json({ error: "Tüm servislerde limit dolmuş veya erişilemedi." });
}
