const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
const Recording = require("../models/Recording");
const Student = require("../models/Student");
const ReferenceText = require("../models/ReferenceText");
const Assessment = require("../models/Assessment");
const authenticateToken = require("../middleware/authMiddleware");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/upload", authenticateToken, upload.single("audioFile"), async (req, res) => {
  try {
    let { studentId, referenceTextId } = req.body;
    if (!req.file || !studentId) {
      return res.status(400).json({ error: "Missing file or studentId" });
    }

    const student = await Student.findOne({ studentId, userId: req.user.id });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const referenceText = await ReferenceText.findOne({ textId: referenceTextId });
    if (!referenceText) {
      referenceTextId = "EN-OL-RC-247-1"; 
      console.log("No referenceTextId provided, using default:", referenceTextId);
    }


    const file = req.file;
    const fileName = `${studentId}_${Date.now()}_${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log("Uploading file to S3...");
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const s3Url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
    console.log("File uploaded successfully:", s3Url);


    const newRecording = new Recording({
      studentId: student._id,
      userId: req.user.id, 
      s3Url,
      referenceTextId,
    });
    await newRecording.save();

    if (!student.recordings) {
      student.recordings = []; 
    }
    student.recordings.push(newRecording._id);
    await student.save();
    console.log("Sending file to SAS API for assessment...");
    const sasResponse = await axios.post(
      process.env.SAS_API_URL,
      { s3_url: s3Url, reference_text_id: referenceTextId },
      { headers: { "x-api-key": process.env.SAS_API_KEY, "Content-Type": "application/json" } }
    );
    console.log("SAS API Response:", sasResponse.data);
    const assessment = new Assessment({
      studentId: student._id,
      userId: req.user.id, 
      s3Url,
      referenceTextId,
      reportData: sasResponse.data,
    });
    await assessment.save();
    res.json({
      message: "File uploaded and analyzed successfully",
      student: student.name,
      s3Url,
      assessment: sasResponse.data,
    });
  } catch (err) {
    console.error("S3/SAS API Error:", err);
    res.status(500).json({ error: "Failed to upload or analyze file" });
  }
});

module.exports = router;