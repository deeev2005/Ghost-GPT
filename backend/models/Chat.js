const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    // Simulated AI response (Replace this with OpenAI API)
    const aiReply = `You said: ${prompt}`;

    res.json({ reply: aiReply });
});

module.exports = router;
