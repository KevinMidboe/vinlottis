const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WineSchema = new Schema({
  name: String,
  vivinoLink: String,
  rating: Number,
  occurences: Number,
  id: String,
  year: Number,
  image: String,
  price: String,
  country: String
});

module.exports = mongoose.model("Wine", WineSchema);
