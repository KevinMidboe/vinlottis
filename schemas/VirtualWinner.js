const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VirtualWinner = new Schema({
  name: String,
  phoneNumber: String,
  color: String,
  green: Number,
  blue: Number,
  red: Number,
  yellow: Number
});

module.exports = mongoose.model("VirtualWinner", VirtualWinner);
