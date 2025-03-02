const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  recordings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recording" }]
});

StudentSchema.index({ studentId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Student", StudentSchema);