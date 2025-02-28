const mongoose = require("mongoose");

const ReferenceTextSchema = new mongoose.Schema({
  topic: { type: String, required: true }, // Category or subject of the passage
  textId: { type: String, unique: true, required: true }, // Unique identifier
  textContent: { type: String, required: true } // The actual passage or word
});

module.exports = mongoose.model("ReferenceText", ReferenceTextSchema);
