const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Links to Student
  s3Url: { type: String, required: true }, // AWS S3 File URL
  referenceTextId: { type: String, required: true }, // ID of passage being assessed
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Recording", RecordingSchema);
