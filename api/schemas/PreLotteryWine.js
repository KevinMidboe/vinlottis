const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreLotteryWine = new Schema({
  name: String,
  vivinoLink: String,
  rating: Number,
  id: String,
  year: Number,
  image: String,
  price: String,
  country: String
});

module.exports = mongoose.model("PreLotteryWine", PreLotteryWine);
