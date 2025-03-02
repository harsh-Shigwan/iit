const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, 
  s3Url: { type: String, required: true }, 
  referenceTextId: { type: String, required: true }, 
  reportData: { type: Object, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Assessment", AssessmentSchema);