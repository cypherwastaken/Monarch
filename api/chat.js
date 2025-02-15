const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

module.exports = async (req, res) => {
  console.log("Received request:", req.method);
  console.log("API Key:", process.env.COHERE_API_KEY);
  
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { prompt } = req.body;

  if (!prompt) {
    console.log("No prompt provided");
    res.status(400).json({ error: "No prompt provided" });
    return;
  }

  console.log("Prompt received:", prompt);

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
      console.log("Chat event:", chat);
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
