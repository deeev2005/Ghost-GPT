const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

router.post("/chat", async (req, res) => {
    try {
        const { model, messages } = req.body;  // Model name + chat history from frontend

        const response = await axios.post(
            OPENROUTER_URL,
            {
                model: model, // OpenRouter determines AI based on this
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error in OpenRouter API:", error);
        res.status(500).json({ error: "Error processing chat request" });
    }
});

module.exports = router;
