const express = require("express");
const path = require("path");

const sub = require(path.join(__dirname + "/../api/subscriptions"));

const _wineFunctions = require(path.join(__dirname + "/../api/wine"));
const _personFunctions = require(path.join(__dirname + "/../api/person"));
const Subscription = require(path.join(__dirname + "/../schemas/Subscription"));
const Lottery = require(path.join(__dirname + "/../schemas/Purchase"));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));

const submitWines = async (req, res) => {
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
  console.log("Sending new wines w/ push notification to all subscribers.")
  for (let i = 0; i < subs.length; i++) {
    let subscription = subs[i]; //get subscription from your databse here.

    const message = JSON.stringify({
      message: "Dagens vin er lagt til, se den på lottis.vin/dagens!",
      title: "Ny vin!",
      link: "/dagens"
    });

    try {
      sub.sendNotification(subscription, message);
    } catch (error) {
      console.error("Error when trying to send push notification to subscriber.");
      console.error(error);
    }
  }

  return res.send({
    message: "Submitted and notified push subscribers of new wines!",
    success: true
  });
};

const schema = async (req, res) => {
  let schema = { ...PreLotteryWine.schema.obj };
  let nulledSchema = Object.keys(schema).reduce((accumulator, current) => {
    accumulator[current] = "";
    return accumulator
  }, {});

  return res.send(nulledSchema);
}

// TODO IMPLEMENT WITH FRONTEND (unused)
const submitWinesToLottery = async (req, res) => {
  const { lottery } = req.body;
  const { date, wines } = lottery;
  const wineObjects = await Promise.all(wines.map(async (wine) => await _wineFunctions.findSaveWine(wine)))

  return Lottery.findOneAndUpdate({ date: date }, {
      date: date,
      wines: wineObjects
    }, {
      upsert: true
    }).then(_ => res.send(true))
      .catch(err => res.status(500).send({ message: 'Unexpected error while updating/saving wine to lottery.',
                                           success: false,
                                           exception: err.message }));
}

 /**
  * @apiParam (Request body) {Array} winners List of winners
  */
const submitWinnersToLottery = async (req, res) => {
  const { lottery } = req.body;
  const { winners, date } = lottery;

  for (let i = 0; i < winners.length; i++) {
    let currentWinner = winners[i];
    let wonWine = await _wineFunctions.findSaveWine(currentWinner.wine); // TODO rename to findAndSaveWineToLottery
    await _personFunctions.findSavePerson(currentWinner, wonWine, date); // TODO rename to findAndSaveWineToPerson
  }

  return res.json(true);
}

 /**
  * @apiParam (Request body) {Date} date Date of lottery
  * @apiParam (Request body) {Number} blue Number of blue tickets
  * @apiParam (Request body) {Number} red Number of red tickets
  * @apiParam (Request body) {Number} green Number of green tickets
  * @apiParam (Request body) {Number} yellow Number of yellow tickets
  * @apiParam (Request body) {Number} bought Number of tickets bought
  * @apiParam (Request body) {Number} stolen Number of tickets stolen
  */
const submitLottery = async (req, res) => {
  const { lottery } = req.body

  const { date,
          blue,
          red,
          yellow,
          green,
          bought,
          stolen } = lottery;

  return Lottery.findOneAndUpdate({ date: date }, {
      date: date,
      blue: blue,
      yellow: yellow,
      red: red,
      green: green,
      bought: bought,
      stolen: stolen
    }, {
      upsert: true
    }).then(_ => res.send(true))
      .catch(err => res.status(500).send({ message: 'Unexpected error while updating/saving lottery.',
                                           success: false,
                                           exception: err.message }));

  return res.send(true);
};

module.exports = {
  submitWines,
  schema,
  submitLottery,
  submitWinnersToLottery,
  submitWinesToLottery
};
