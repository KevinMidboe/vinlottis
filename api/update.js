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

router.use((req, res, next) => {
  next();
});

router.route("/log").post(async (req, res) => {
  if (!req.isAuthenticated()) {
    return;
  }
  const purchaseBody = req.body.purchase;
  const winnersBody = req.body.winners;

  const date = purchaseBody.date;
  const blue = purchaseBody.blue;
  const red = purchaseBody.red;
  const yellow = purchaseBody.yellow;
  const green = purchaseBody.green;

  const winesThisDate = [];

  for (let i = 0; i < winnersBody.length; i++) {
    let currentWinner = winnersBody[i];

    let wonWine = await Wine.findOne({ name: currentWinner.wine.name });
    if (wonWine == undefined) {
      const newWonWine = new Wine({
        name: currentWinner.wine.name,
        vivinoLink: currentWinner.wine.vivinoLink,
        rating: currentWinner.wine.rating,
        occurences: 1
      });
      await newWonWine.save();
      wonWine = newWonWine;
    } else {
      wonWine.occurences += 1;
      await wonWine.save();
    }

    winesThisDate.push(wonWine);

    const person = await Highscore.findOne({
      name: currentWinner.name
    });

    if (person == undefined) {
      let newPerson = new Highscore({
        name: currentWinner.name,
        wins: [
          {
            color: currentWinner.color,
            date: date,
            wine: wonWine
          }
        ]
      });

      await newPerson.save();
    } else {
      person.wins.push({
        color: currentWinner.color,
        date: date,
        wine: wonWine
      });
      person.markModified("wins");
      await person.save();
    }
  }

  let purchase = new Purchase({
    date: date,
    blue: blue,
    yellow: yellow,
    red: red,
    green: green,
    wines: winesThisDate
  });

  await purchase.save();

  res.send(true);
});

module.exports = router;
