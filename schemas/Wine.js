const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wine = new Schema({
  name: String,
  vivinoLink: String,
  rating: Number
});

module.exports = Wine;
