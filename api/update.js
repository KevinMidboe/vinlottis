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

const _wineFunctions = require(path.join(__dirname + "/../api/wine"));
const _personFunctions = require(path.join(__dirname + "/../api/person"));
const Subscription = require(path.join(__dirname + "/../schemas/Subscription"));
const Purchase = require(path.join(__dirname + "/../schemas/Purchase"));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));

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

    let wonWine = await _wineFunctions.findSaveWine(currentWinner);
    winesThisDate.push(wonWine);

    await _personFunctions.findSavePerson(currentWinner, wonWine, date);
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
