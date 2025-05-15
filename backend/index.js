require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const chatRoutes = require("./routes/chat");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Default Route
app.get("/", (req, res) => {
    res.send("AI Integration Backend is running...");
});

// Import Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
