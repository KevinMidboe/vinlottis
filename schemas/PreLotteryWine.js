const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreLotteryWine = new Schema({
  name: String,
  vivinoLink: String,
  rating: Number
});

module.exports = mongoose.model("PreLotteryWine", PreLotteryWine);
