const express = require("express");
const { spawn } = require("child_process");
const ChatHistory = require("../models/Chat"); // Import Chat model

const router = express.Router();

router.post("/chat", async (req, res) => {
    const { model, prompt } = req.body;  // Get model and prompt from frontend

    const pythonProcess = spawn("python", ["script.py", model, prompt]); // Pass model + prompt

    let responseData = "";
    pythonProcess.stdout.on("data", (data) => {
        responseData += data.toString();
    });

    pythonProcess.on("close", async () => {
        try {
            const aiResponse = JSON.parse(responseData);  // Convert response to JSON

            // ✅ Store chat history in MongoDB
            const newChat = new ChatHistory({
                model,
                userMessage: prompt,
                aiResponse: aiResponse.response,  // AI response from script.py
            });

            await newChat.save(); // Save to MongoDB

            res.json({ success: true, response: aiResponse.response });

        } catch (err) {
            res.status(500).json({ error: "Invalid response from AI", details: err.message });
        }
    });

    pythonProcess.on("error", (err) => {
        res.status(500).json({ error: "Python script execution failed", details: err.message });
    });
});

module.exports = router;
