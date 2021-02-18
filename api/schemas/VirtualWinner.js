const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VirtualWinner = new Schema({
  name: String,
  phoneNumber: String,
  color: String,
  green: Number,
  blue: Number,
  red: Number,
  yellow: Number,
  id: String,
  prize_selected: {
    type: Boolean,
    default: false
  },
  timestamp_drawn: Number,
  timestamp_sent: Number,
  timestamp_limit: Number
});

module.exports = mongoose.model("VirtualWinner", VirtualWinner);
