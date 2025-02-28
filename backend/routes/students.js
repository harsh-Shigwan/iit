const express = require("express");
const Student = require("../models/Student");
const authenticateToken  = require("../middleware/authMiddleware")
const router = express.Router();




// 🟢 Register a New Student
router.post("/register", async (req, res) => {
  try {
    const { name, studentId } = req.body;
    if (!name || !studentId) return res.status(400).json({ error: "Name and studentId are required" });

    // Check if student already exists
    let student = await Student.findOne({ studentId });
    if (student) return res.status(400).json({ error: "Student already registered" });

    student = new Student({ name, studentId });
    await student.save();

    res.json({ message: "Student registered successfully", student });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Get All Students
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const students = await Student.find();
   
    res.json({ students });
  } catch (err) {
    console.error("Error fetching all students:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Get Student by ID (Fetch student details & recordings)
router.get("/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId }).populate("recordings" , );
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ student });
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🟢 Update Student (Edit)
router.put("/:studentId", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.studentId },
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

// 🟢 Delete Student
router.delete("/:studentId", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;