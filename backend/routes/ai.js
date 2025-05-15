const express = require("express");
const fetch = require("node-fetch"); // ✅ Ensure you installed node-fetch
const router = express.Router();

router.post("/openrouter", async (req, res) => {
    const { prompt, model } = req.body;
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: model || "gpt-4-turbo",
                messages: [{ role: "user", content: prompt }]
            }),
        });

        const data = await response.json();
        res.json({ response: data.choices?.[0]?.message?.content || "No response from AI." });

    } catch (error) {
        console.error("OpenRouter API error:", error);
        res.status(500).json({ error: "Failed to fetch AI response." });
    }
});

module.exports = router;
