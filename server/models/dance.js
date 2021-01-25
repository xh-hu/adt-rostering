const mongoose = require("mongoose");

const DanceSchema = new mongoose.Schema({
  danceName: String,
  danceId: Number,
  members: Array,
});

module.exports = mongoose.model("dance", DanceSchema);