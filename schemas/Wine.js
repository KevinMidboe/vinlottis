const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wine = new Schema({
  name: String,
  vivinoLink: String,
  rating: Number,
  occurences: Number,
  id: String,
  image: String
});

module.exports = mongoose.model("Wine", Wine);
