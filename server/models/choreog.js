const mongoose = require("mongoose");

const ChoreogSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("choreog", ChoreogSchema);