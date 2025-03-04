const express = require("express");
const Assessment = require("../models/Assessment");
const Student = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});


router.get("/all", authenticateToken, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id }).populate("studentId", "name studentId");
    res.json(assessments);
  } catch (err) {
    console.error("Error fetching assessments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:studentId", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId, userId: req.user.id });
    if (!student) return res.status(404).json({ error: "Student not found" });
    const assessments = await Assessment.find({ studentId: student._id, userId: req.user.id });
    res.json({ student: student.name, assessments });
  } catch (err) {
    console.error("Error fetching student assessments:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:assessmentId", authenticateToken, async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;

    const assessment = await Assessment.findOne({ _id: assessmentId, userId: req.user.id });
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    const s3Url = assessment.s3Url;
    const fileName = s3Url.split("/").pop(); // 

   
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    console.log("Deleting file from S3:", fileName);
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log("File deleted from S3 successfully.");

    await Assessment.findByIdAndDelete(assessmentId);
    
    res.json({ message: "Assessment and corresponding file deleted successfully" });
  } catch (err) {
    console.error("Error deleting assessment:", err);
    res.status(500).json({ error: "Failed to delete assessment" });
  }
});

module.exports = router;
