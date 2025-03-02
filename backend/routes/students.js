const express = require("express");
const Student = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/register", authenticateToken, async (req, res) => {
  try {
    const { name, studentId } = req.body;
    if (!name || !studentId) return res.status(400).json({ error: "Name and studentId are required" });
    let student = await Student.findOne({ studentId, userId: req.user.id });
    if (student) {
      return res.status(400).json({ error: "Student already registered" });
    }
    student = new Student({ name, studentId, userId: req.user.id });
    await student.save();
    res.json({ message: "Student registered successfully", student });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/all", authenticateToken, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id }); 
    res.json({ students });
  } catch (err) {
    console.error("Error fetching all students:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:studentId", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId, userId: req.user.id }).populate("recordings");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ student });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:studentId", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.studentId, userId: req.user.id },  
      { name },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:studentId", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.studentId, userId: req.user.id }); 
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;