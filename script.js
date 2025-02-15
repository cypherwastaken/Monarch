document.getElementById("send-button").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    appendMessage(userInput, "user-message");
    document.getElementById("user-input").value = "";

    const botResponse = await fetchBotResponse(userInput);
    appendMessage(botResponse, "bot-message");
});

function appendMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${className}`;
    messageElement.textContent = text;
    document.getElementById("chat-box").appendChild(messageElement);

    // Scroll to the bottom
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchBotResponse(prompt) {
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        return data.response || "Something went wrong!";
    } catch (error) {
        return "Error: Unable to fetch response.";
    }
}
