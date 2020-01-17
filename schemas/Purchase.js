const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Purchase = new Schema({
  date: Date,
  blue: Number,
  red: Number,
  yellow: Number,
  green: Number
});

module.exports = Purchase;
