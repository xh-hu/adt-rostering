const mongoose = require("mongoose");

const DancerSchema = new mongoose.Schema({
  emailAddr: String,
  firstName: String,
  nickname: String,
  lastName: String,
  phoneNum: String,
  year: String,
  auditionNum: String,
  numDances: Number,
  dance_0: Number,
  dance_1: Number,
  dance_2: Number,
  dance_3: Number,
  dance_4: Number,
  dance_5: Number,
  dance_6: Number,
  dance_7: Number,
  dance_8: Number,
  dance_9: Number,
  dance_10: Number,
  dance_11: Number,
  dance_12: Number,
  dance_13: Number,
  dance_14: Number,
  dance_15: Number,
  dance_16: Number,
  dance_17: Number,
  comments: String
});

// compile model from schema
module.exports = mongoose.model("dancer", DancerSchema);