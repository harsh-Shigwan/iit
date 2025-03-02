const mongoose = require("mongoose");

const ReferenceTextSchema = new mongoose.Schema({
  topic: { type: String, required: true }, 
  textId: { type: String, unique: true, required: true }, 
  textContent: { type: String, required: true } 
});

module.exports = mongoose.model("ReferenceText", ReferenceTextSchema);
