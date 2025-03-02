const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, 
  s3Url: { type: String, required: true },
  referenceTextId: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Recording", RecordingSchema);