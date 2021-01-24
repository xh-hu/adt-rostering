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
  dance_farFromHome: Number,
  dance_rainyBamboo: Number,
  dance_eternally: Number,
  dance_moodForLove: Number,
  dance_365: Number,
  dance_subtlety: Number,
  dance_cantAsk: Number,
  dance_butterflies: Number,
  dance_lionMonster: Number,
  dance_play: Number,
  dance_salty: Number,
  dance_knock: Number,
  dance_urCandy: Number,
  dance_switch: Number,
  dance_complete: Number,
  dance_summer: Number,
  dance_godsMenu: Number,
  dance_f: Number,
  comments: String
});

// compile model from schema
module.exports = mongoose.model("dancer", DancerSchema);