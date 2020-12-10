const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Purchase = new Schema({
  date: Date,
  blue: Number,
  red: Number,
  yellow: Number,
  green: Number,
  bought: Number,
  stolen: Number,
  wines: [
    {
      type: Schema.Types.ObjectId,
      ref: "Wine"
    }
  ]
});

module.exports = mongoose.model("Purchase", Purchase);
