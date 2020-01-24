const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const Purchase = require(path.join(__dirname + "/../schemas/Purchase"));
const Wine = require(path.join(__dirname + "/../schemas/Wine"));
const Highscore = require(path.join(__dirname + "/../schemas/Highscore"));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));

router.use((req, res, next) => {
  next();
});

router.route("/wines/prelottery").get(async (req, res) => {
  let wines = await PreLotteryWine.find();
  res.json(wines);
});

router.route("/purchase/statistics").get(async (req, res) => {
  let purchases = await Purchase.find()
    .populate("wines")
    .sort({ date: 1 });
  res.json(purchases);
});

router.route("/purchase/statistics/color").get(async (req, res) => {
  const countColor = await Purchase.find();
  let red = 0;
  let blue = 0;
  let yellow = 0;
  let green = 0;
  for (let i = 0; i < countColor.length; i++) {
    let element = countColor[i];
    red += element.red;
    blue += element.blue;
    yellow += element.yellow;
    green += element.green;
  }

  const highscore = await Highscore.find();
  let redWin = 0;
  let blueWin = 0;
  let yellowWin = 0;
  let greenWin = 0;
  for (let i = 0; i < highscore.length; i++) {
    let element = highscore[i];
    for (let y = 0; y < element.wins.length; y++) {
      let currentWin = element.wins[y];
      switch (currentWin.color) {
        case "blue":
          blueWin += 1;
          break;
        case "red":
          redWin += 1;
          break;
        case "yellow":
          yellowWin += 1;
          break;
        case "green":
          greenWin += 1;
          break;
      }
    }
  }

  const total = red + yellow + blue + green;

  res.json({
    red: {
      total: red,
      win: redWin
    },
    blue: {
      total: blue,
      win: blueWin
    },
    green: {
      total: green,
      win: greenWin
    },
    yellow: {
      total: yellow,
      win: yellowWin
    },
    total: total
  });
});

router.route("/highscore/statistics").get(async (req, res) => {
  const highscore = await Highscore.find().populate("wins.wine");

  res.json(highscore);
});

router.route("/wines/statistics").get(async (req, res) => {
  const wines = await Wine.find();

  res.json(wines);
});

module.exports = router;
