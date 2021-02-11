const mongoose = require("mongoose");

const DanceSchema = new mongoose.Schema({
  danceName: String,
  danceId: String,
  members: Array,
  style: String,
});

module.exports = mongoose.model("dance", DanceSchema);