const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const _wineFunctions = require(path.join(__dirname + "/../api/wine"));
const _personFunctions = require(path.join(__dirname + "/../api/person"));
const Message = require(path.join(__dirname + "/../api/message"));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
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
  date.setHours(5, 0, 0, 0);

  let prelotteryWine = await PreLotteryWine.findOne({ name: wineName });

  if (!prelotteryWine) {
    res.json({
      success: false,
      wine: true
    });
  }

  let wonWine = await _wineFunctions.findSaveWine(prelotteryWine);
  await prelotteryWine.delete();
  await _personFunctions.findSavePerson(foundWinner, wonWine, date);

  await foundWinner.delete();

  let nextWineBottle = await PreLotteryWine.find();
  let nextWinner = await VirtualWinner.find().sort({ timestamp_drawn: 1 });
  if (nextWinner.length > 1 && nextWineBottle.length > 1) {
    Message.sendMessage(nextWinner[0]);
    startTimeout(id);
  } else if (nextWinner.length == 1 && nextWineBottle.length == 1) {
    chooseForUser(nextWinner[0], nextWineBottle[0]);
  }

  res.json({
    success: true
  });
  return;
});

async function chooseForUser(winner, prelotteryWine) {
  let date = new Date();
  date.setHours(5, 0, 0, 0);
  let wonWine = await _wineFunctions.findSaveWine(prelotteryWine);
  await _personFunctions.findSavePerson(winner, wonWine, date);

  await prelotteryWine.delete();
  await Message.sendWonWineMessage(winner, prelotteryWine);
  await winner.delete();
}

function startTimeout(id) {
  console.log(`Starting timeout for user ${id}.`);
  setTimeout(async () => {
    let virtualWinner = await VirtualWinner.findOne({ id: id });
    if (!virtualWinner) {
      console.log(
        `Timeout done for user ${id}, but user has already sent data.`
      );
      return;
    }
    console.log(`Timeout done for user ${id}, sending update to user.`);

    Message.sendMessageTooLate(virtualWinner);

    virtualWinner.timestamp_drawn = new Date().getTime();
    virtualWinner.timestamp_limit = null;
    virtualWinner.timestamp_sent = null;

    await virtualWinner.save();

    let prelotteryWine = await PreLotteryWine.find();
    let nextWinner = await VirtualWinner.find().sort({ timestamp_drawn: 1 });
    if (nextWinner.length == 1 && prelotteryWine.length == 1) {
      chooseForUser(nextWinner[0], prelotteryWine[0]);
    }
  }, 600000);
}

module.exports = router;
