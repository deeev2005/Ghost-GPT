const express = require("express");
const router = express.Router();

// Example Auth Route
router.get("/test", (req, res) => {
    res.send("Auth route working!");
});

module.exports = router; // ✅ Ensure this line exports `router`
