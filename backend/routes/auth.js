const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; 

router.post("/signup", async (req, res) => {
    try {
    console.log("Signup Request Body:", req.body); 
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      let teacher = await Teacher.findOne({ email });
      if (teacher) {
        console.log("Teacher already exists:", teacher);
        return res.status(400).json({ error: "Email already registered" });
      } 
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword); 
      teacher = new Teacher({ name, email, password: hashedPassword });
      await teacher.save();
      console.log("Teacher saved successfully:", teacher); 
      res.json({ message: "Teacher registered successfully" });
    } catch (err) {
      console.error("Signup Error:", err.message);  
      res.status(500).json({ error: "Server error" });
    }
  });
  

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    const verified = jwt.verify(token, JWT_SECRET);
    const teacher = await Teacher.findById(verified.id).select("-password");
    res.json(teacher);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});


router.put("/profile", async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ error: "Access denied" });
        const verified = jwt.verify(token, JWT_SECRET);
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher && existingTeacher._id.toString() !== verified.id) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            verified.id,
            { name, email },
            { new: true, select: "-password" }
        );
        res.json(updatedTeacher);
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});


module.exports = router;
