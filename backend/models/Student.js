const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, unique: true, required: true },
  recordings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assessment" }] // Links to Assessments
});

module.exports = mongoose.model("Student", StudentSchema);
