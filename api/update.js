const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const sub = require(path.join(__dirname + "/../api/subscriptions"));
const mustBeAuthenticated = require(path.join(
  __dirname + "/../middleware/mustBeAuthenticated"
));

const Subscription = require(path.join(__dirname + "/../schemas/Subscription"));
const Purchase = require(path.join(__dirname + "/../schemas/Purchase"));
const Wine = require(path.join(__dirname + "/../schemas/Wine"));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));
const Highscore = require(path.join(__dirname + "/../schemas/Highscore"));

router.use((req, res, next) => {
  next();
});

router.route("/log/wines").post(mustBeAuthenticated, async (req, res) => {
  const wines = req.body;
  for (let i = 0; i < wines.length; i++) {
    let wine = wines[i];
    let newWonWine = new PreLotteryWine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: wine.rating,
      image: wine.image,
      price: wine.price,
      country: wine.country,
      id: wine.id
    });
    await newWonWine.save();
  }

  let subs = await Subscription.find();
  for (let i = 0; i < subs.length; i++) {
    let subscription = subs[i]; //get subscription from your databse here.
    const message = JSON.stringify({
      message: "Dagens vin er lagt til, se den på lottis.vin/dagens!",
      title: "Ny vin!",
      link: "/#/dagens"
    });
    sub.sendNotification(subscription, message);
  }

  res.send(true);
});

router.route("/log/schema").get(mustBeAuthenticated, async (req, res) => {
  let schema = { ...PreLotteryWine.schema.obj };
  let nulledSchema = Object.keys(schema).reduce((accumulator, current) => {
    accumulator[current] = "";
    return accumulator;
  }, {});

  res.send(nulledSchema);
});

router.route("/log").post(mustBeAuthenticated, async (req, res) => {
  await PreLotteryWine.deleteMany();

  const purchaseBody = req.body.purchase;
  const winnersBody = req.body.winners;

  const date = purchaseBody.date;
  const blue = purchaseBody.blue;
  const red = purchaseBody.red;
  const yellow = purchaseBody.yellow;
  const green = purchaseBody.green;

  const bought = purchaseBody.bought;
  const stolen = purchaseBody.stolen;

  const winesThisDate = [];

  for (let i = 0; i < winnersBody.length; i++) {
    let currentWinner = winnersBody[i];

    let wonWine = await Wine.findOne({ name: currentWinner.wine.name });
    if (wonWine == undefined) {
      let newWonWine = new Wine({
        name: currentWinner.wine.name,
        vivinoLink: currentWinner.wine.vivinoLink,
        rating: currentWinner.wine.rating,
        occurences: 1,
        image: currentWinner.wine.image,
        id: currentWinner.wine.id
      });
      await newWonWine.save();
      wonWine = newWonWine;
    } else {
      wonWine.occurences += 1;
      wonWine.image = currentWinner.wine.image;
      wonWine.id = currentWinner.wine.id;
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
    wines: winesThisDate,
    bought: bought,
    stolen: stolen
  });

  await purchase.save();

  res.send(true);
});

module.exports = router;
