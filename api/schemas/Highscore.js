const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Highscore = new Schema({
  name: String,
  wins: [
    {
      color: String,
      date: Date,
      wine: {
        type: Schema.Types.ObjectId,
        ref: "Wine"
      }
    }
  ]
});

module.exports = mongoose.model("Highscore", Highscore);
