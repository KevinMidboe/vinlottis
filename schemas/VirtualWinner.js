const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VirtualWinner = new Schema({
  name: String,
  phoneNumber: String,
  color: String
});

module.exports = mongoose.model("VirtualWinner", VirtualWinner);
