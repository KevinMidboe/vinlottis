const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestedWine = new Schema({
  count: Number,
  wineId: String,
  wine: {
    type: Schema.Types.ObjectId,
    ref: "Wine"
  }
});

module.exports = mongoose.model("RequestedWine", RequestedWine);
