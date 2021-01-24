const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  name: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);