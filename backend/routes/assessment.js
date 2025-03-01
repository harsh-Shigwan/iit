const express = require("express");
const Assessment = require("../models/Assessment");
const Student = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Get All Assessments (For Teachers)
router.get("/all", authenticateToken,  async (req, res) => {
  try {
    const assessments = await Assessment.find().populate("studentId", "name studentId");
    res.json(assessments);
  } catch (err) {
    console.error("Error fetching assessments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:studentId", authenticateToken, async (req, res) => {
  try {
    // Find the student by studentId
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Fetch assessments for this student
    const assessments = await Assessment.find({ studentId: student._id });

    res.json({ student: student.name, assessments });
  } catch (err) {
    console.error("Error fetching student assessments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:assessmentId", authenticateToken, async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;

    // Check if the assessment exists
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    // Delete the assessment
    await Assessment.findByIdAndDelete(assessmentId);

    res.json({ message: "Assessment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assessment:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
