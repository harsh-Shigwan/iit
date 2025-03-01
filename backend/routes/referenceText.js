const express = require("express");
const ReferenceText = require("../models/ReferenceText");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Add a New Reference Text with Topic
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { topic, textId, textContent } = req.body;
    if (!topic || !textId || !textContent)
      return res
        .status(400)
        .json({ error: "Topic, textId, and textContent are required" });

    const existingText = await ReferenceText.findOne({ textId });
    if (existingText)
      return res.status(400).json({ error: "Reference text already exists" });

    const newText = new ReferenceText({ topic, textId, textContent });
    await newText.save();

    res.json({
      message: "Reference text added successfully",
      referenceText: newText,
    });
  } catch (err) {
    console.error("Error adding reference text:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Get All Reference Texts with Topic
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const texts = await ReferenceText.find();
    res.json(texts);
  } catch (err) {
    console.error("Error fetching reference texts:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
