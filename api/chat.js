const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "No prompt provided" });
    return;
  }

  try {
    const stream = await cohere.chatStream({
      model: "command-nightly",
      message: prompt,
      temperature: 0.1,
      chatHistory: [],
      promptTruncation: "AUTO",
    });

    let responseText = "";
    for await (const chat of stream) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }

    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to fetch response", details: error.message });
  }
};
