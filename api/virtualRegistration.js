const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const Message = require(path.join(__dirname + "/../api/message"));
const config = require(path.join(__dirname + "/../config/defaults/push"));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));
const Highscore = require(path.join(__dirname + "/../schemas/Highscore"));
const Wine = require(path.join(__dirname + "/../schemas/Wine"));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));
const lotteryConfig = require(path.join(
  __dirname + "/../config/defaults/lottery"
));

router.use((req, res, next) => {
  next();
});

router.route("/winner/:id").get((req, res) => {
  res.redirect(`/#/winner/${req.params.id}`);
});

router.route("/:id").get(async (req, res) => {
  let id = req.params.id;

  let foundWinner = await VirtualWinner.findOne({ id: id });

  if (!foundWinner) {
    res.json({
      existing: false,
      turn: false
    });
    return;
  }

  let allWinners = await VirtualWinner.find().sort({ timestamp_drawn: 1 });

  if (
    allWinners[0].id != foundWinner.id ||
    foundWinner.timestamp_limit == undefined ||
    foundWinner.timestamp_sent == undefined
  ) {
    res.json({ existing: true, turn: false });
    return;
  }

  res.json({
    existing: true,
    turn: true,
    name: foundWinner.name,
    color: foundWinner.color
  });
  return;
});

router.route("/:id").post(async (req, res) => {
  let id = req.params.id;
  let wineName = req.body.wineName;
  let foundWinner = await VirtualWinner.findOne({ id: id });

  if (!foundWinner) {
    res.json(false);
    return;
  }

  if (foundWinner.timestamp_limit < new Date().getTime()) {
    res.json({
      success: false,
      limit: true
    });
    return;
  }
  let date = new Date();

  let prelotteryWine = await PreLotteryWine.findOne({ name: wineName });

  if (!prelotteryWine) {
    res.json({
      success: false,
      wine: true
    });
  }

  let wonWine = await Wine.findOne({ name: prelotteryWine.name });
  if (wonWine == undefined) {
    let newWonWine = new Wine({
      name: prelotteryWine.name,
      vivinoLink: prelotteryWine.vivinoLink,
      rating: prelotteryWine.rating,
      occurences: 1,
      image: prelotteryWine.image,
      id: prelotteryWine.id
    });
    await newWonWine.save();
    wonWine = newWonWine;
  } else {
    wonWine.occurences += 1;
    wonWine.image = prelotteryWine.image;
    wonWine.id = prelotteryWine.id;
    await wonWine.save();
  }

  await prelotteryWine.delete();

  const person = await Highscore.findOne({
    name: foundWinner.name
  });

  if (person == undefined) {
    let newPerson = new Highscore({
      name: foundWinner.name,
      wins: [
        {
          color: foundWinner.color,
          date: date,
          wine: wonWine
        }
      ]
    });

    await newPerson.save();
  } else {
    person.wins.push({
      color: foundWinner.color,
      date: date,
      wine: wonWine
    });
    person.markModified("wins");
    await person.save();
  }

  await foundWinner.delete();

  let nextWinner = await VirtualWinner.find().sort({ timestamp_drawn: 1 });
  if (nextWinner.length > 0) {
    Message.sendMessage(nextWinner[0]);
  }

  startTimeout(id);

  res.json({
    success: true
  });
  return;
});

function startTimeout(id) {
  setTimeout(async () => {
    let virtualWinner = await VirtualWinner.findOne({ id: id });
    if (!virtualWinner) {
      return;
    }

    Message.sendMessageTooLate(virtualWinner);

    virtualWinner.timestamp_drawn;
    virtualWinner.timestamp_limit = null;
    virtualWinner.timestamp_sent = null;

    await virtualWinner.save();
  }, 600000);
}

module.exports = router;
