const mongoose = require("mongoose");

const ChoreogSchema = new mongoose.Schema({
  name: String,
  email: String,
  dance_name: String,
  dance_index: String,
  style: String,
});

module.exports = mongoose.model("choreog", ChoreogSchema);