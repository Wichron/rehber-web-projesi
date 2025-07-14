import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });

    const responseText = completion.data.choices[0].message.content;
    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
