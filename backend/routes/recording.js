const express = require("express");
const Recording = require("../models/Recording");
const Student = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const recordings = await Recording.find().populate("studentId", "name studentId");
    res.json(recordings);
  } catch (err) {
    console.error("Error fetching recordings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:studentId", authenticateToken,async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }).populate("recordings");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ student: student.name, recordings: student.recordings });
  } catch (err) {
    console.error("Error fetching student recordings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
