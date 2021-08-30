const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  day: String,
  time: String,
  location: String,
  claimers: Array,
});

module.exports = mongoose.model("schedule", ScheduleSchema);