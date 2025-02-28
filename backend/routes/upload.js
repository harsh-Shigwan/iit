

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

// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Configure Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🟢 Upload Audio File & Analyze with SAS API
router.post("/upload", authenticateToken,  upload.single("audioFile"), async (req, res) => {
  try {
    let { studentId, referenceTextId } = req.body;

    if (!req.file || !studentId) {
      return res.status(400).json({ error: "Missing file or studentId" });
    }

    // 🔹 Set Default `referenceTextId` if not provided
    // if (!referenceTextId) {
    //   referenceTextId = "EN-OL-RC-247-1"; // Default passage ID
    //   console.log("No referenceTextId provided, using default:", referenceTextId);
    // }

    // 🔹 Validate Reference Text
    const referenceText = await ReferenceText.findOne({ textId: referenceTextId });
    if (!referenceText) {
      referenceTextId = "EN-OL-RC-247-1";
      console.log("No referenceTextId provided, using default:", referenceTextId);
      
    }

    // 🔹 Validate Student
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // 🔹 Upload File to AWS S3
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

    // 🔹 Generate S3 URL
    const s3Url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
    console.log("File uploaded successfully:", s3Url);

    // 🔹 Save Recording in MongoDB
    const newRecording = new Recording({
      studentId: student._id,
      s3Url,
      referenceTextId,
    });

    await newRecording.save();

    // 🔹 Link Recording to Student
    if (!student.recordings) {
      student.recordings = []; // Initialize if undefined
    }
    student.recordings.push(newRecording._id);
    await student.save();

    // 🔹 Send Recording to SAS API
    console.log("Sending file to SAS API for assessment...");
    const sasResponse = await axios.post(
      process.env.SAS_API_URL,
      { s3_url: s3Url, reference_text_id: referenceTextId },
      { headers: { "x-api-key": process.env.SAS_API_KEY, "Content-Type": "application/json" } }
    );

    console.log("SAS API Response:", sasResponse.data);

    // 🔹 Store Assessment Data in MongoDB
    const assessment = new Assessment({
      studentId: student._id,
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




//  22 /2/2025
// const express = require("express");
// const multer = require("multer");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const Recording = require("../models/Recording");
// const Student = require("../models/Student");
// require("dotenv").config();
// const ReferenceText = require("../models/ReferenceText");
// const router = express.Router();

// // Configure AWS S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
// });

// // Configure Multer for File Uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // 🟢 Upload Audio File & Save to MongoDB
// router.post("/upload", upload.single("audioFile"), async (req, res) => {
//   try {
//     const { studentId, referenceTextId } = req.body;

//     if (!req.file || !studentId || !referenceTextId) {
//       return res.status(400).json({ error: "Missing file, studentId, or referenceTextId" });
//     }
//     const referenceText = await ReferenceText.findOne({ textId: referenceTextId });
//     if (!referenceText) {
//       return res.status(404).json({ error: "Reference text not found" });
//     }
//     // 🔹 Find Student in MongoDB
//     const student = await Student.findOne({ studentId });
//     if (!student) return res.status(404).json({ error: "Student not found" });

//     // 🔹 Upload File to AWS S3
//     const file = req.file;
//     const fileName = `${studentId}_${Date.now()}_${file.originalname}`;
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     console.log("Uploading file to S3...");
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     // 🔹 Generate S3 URL
//     const s3Url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;
//     console.log("File uploaded successfully:", s3Url);

//     // 🔹 Save Recording in MongoDB
//     const newRecording = new Recording({
//       studentId: student._id,
//       s3Url,
//       referenceTextId,
//     });

//     await newRecording.save();

//     // 🔹 Link Recording to Student
//     student.recordings.push(newRecording._id);
//     await student.save();

//     res.json({
//       message: "File uploaded and saved successfully",
//       student: student.name,
//       s3Url,
//     });
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

// module.exports = router;

























































//21/02/2025
// const express = require("express");
// const multer = require("multer");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// require("dotenv").config();

// const router = express.Router();

// // Configure AWS S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
// });

// // Configure Multer for File Uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // 🟢 Upload Audio File to S3
// router.post("/upload", upload.any(), async (req, res) => {
//   console.log("Files received:", req.files);

//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const file = req.files[0]; // Get the first file
//   console.log("Processing file:", file.originalname);

//   const fileName = `${Date.now()}_${file.originalname}`;
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   try {
//     console.log("Uploading file to S3...");
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
//     console.log("File uploaded successfully:", fileUrl);

//     res.json({ s3Url: fileUrl });
//   } catch (err) {
//     console.error("S3 Upload Error:", err);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });


// module.exports = router;

