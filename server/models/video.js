const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  name: String,
  email: String,
  hiphop: String,
  trad: String,
  comments: String,
});

module.exports = mongoose.model("video", VideoSchema);