const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Attendee = new Schema({
  name: String,
  phoneNumber: String,
  green: Number,
  blue: Number,
  red: Number,
  yellow: Number,
  winner: Boolean
});

module.exports = mongoose.model("Attendee", Attendee);
