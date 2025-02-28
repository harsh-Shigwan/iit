require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const uploadRoutes = require("./routes/upload.js");
const authRoutes = require("./routes/auth.js");
const studentRoutes = require("./routes/students");
//import cookieParser from 'cookie-parser';
const referenceTextRoutes = require("./routes/referenceText.js");
const assessmentRoutes = require("./routes/assessment.js");
const recordingRoutes = require("./routes/recording.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Atlas Connection Error:", err));

app.use("/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reference-text", referenceTextRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/recordings", recordingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
