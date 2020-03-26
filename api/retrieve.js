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
  let stolen = 0;
  for (let i = 0; i < countColor.length; i++) {
    let element = countColor[i];
    red += element.red;
    blue += element.blue;
    yellow += element.yellow;
    green += element.green;
    if (element.stolen != undefined) {
      stolen += element.stolen;
    }
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
    stolen: stolen,
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

router.route("/wines/statistics/overall").get(async (req, res) => {
  const highscore = await Highscore.find().populate("wins.wine");
  let wines = {};

  for (let i = 0; i < highscore.length; i++) {
    let person = highscore[i];
    for (let y = 0; y < person.wins.length; y++) {
      let wine = person.wins[y].wine;
      let date = person.wins[y].date;
      let color = person.wins[y].color;

      if (wines[wine._id] == undefined) {
        wines[wine._id] = {
          name: wine.name,
          occurences: wine.occurences,
          link: wine.link,
          rating: wine.rating,
          image: wine.image,
          id: wine.id,
          _id: wine._id,
          dates: [date],
          winners: [person.name],
          red: 0,
          blue: 0,
          green: 0,
          yellow: 0
        };
        wines[wine._id][color] += 1;
      } else {
        wines[wine._id].dates.push(date);
        wines[wine._id].winners.push(person.name);
        if (wines[wine._id][color] == undefined) {
          wines[wine._id][color] = 1;
        } else {
          wines[wine._id][color] += 1;
        }
      }
    }
  }

  res.json(Object.values(wines));
});

module.exports = router;
