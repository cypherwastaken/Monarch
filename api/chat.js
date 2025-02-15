const fetch = require("node-fetch");

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

    const apiKey = process.env.COHERE_API_KEY;

    try {
        const response = await fetch("https://api.cohere.ai/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "command-nightly",
                message: prompt,
                temperature: 0.4,
                max_tokens: 300,
                chatHistory: [],
                promptTruncation: "AUTO"
            }),
        });

        const data = await response.json();
        res.status(200).json({ response: data.text });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch response" });
    }
};
