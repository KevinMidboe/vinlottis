const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});
let io;
const mustBeAuthenticated = require(path.join(
  __dirname + "/../middleware/mustBeAuthenticated"
));

const Attendee = require(path.join(__dirname + "/../schemas/Attendee"));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));

router.use((req, res, next) => {
  next();
});

router.route("/winners").delete(mustBeAuthenticated, async (req, res) => {
  await VirtualWinner.deleteMany();
  io.emit("refresh_data", {});
  res.json(true);
});

router.route("/attendees").delete(mustBeAuthenticated, async (req, res) => {
  await Attendee.deleteMany();
  io.emit("refresh_data", {});
  res.json(true);
});

router.route("/winners").get(async (req, res) => {
  let winners = await VirtualWinner.find();
  let winnersRedacted = [];
  let winner;
  for (let i = 0; i < winners.length; i++) {
    winner = winners[i];
    winnersRedacted.push({
      name: winner.name,
      color: winner.color
    });
  }
  res.json(winnersRedacted);
});

router.route("/winners/secure").get(mustBeAuthenticated, async (req, res) => {
  let winners = await VirtualWinner.find();

  res.json(winners);
});

router.route("/winner").get(mustBeAuthenticated, async (req, res) => {
  let allContestants = await Attendee.find();
  if (allContestants.length == 0) {
    res.json(false);
    return;
  }
  let ballotColors = [];
  for (let i = 0; i < allContestants.length; i++) {
    let currentContestant = allContestants[i];
    for (let blue = 0; blue < currentContestant.blue; blue++) {
      ballotColors.push("blue");
    }
    for (let red = 0; red < currentContestant.red; red++) {
      ballotColors.push("red");
    }
    for (let green = 0; green < currentContestant.green; green++) {
      ballotColors.push("green");
    }
    for (let yellow = 0; yellow < currentContestant.yellow; yellow++) {
      ballotColors.push("yellow");
    }
  }

  let colorToChoseFrom =
    ballotColors[Math.floor(Math.random() * ballotColors.length)];
  let findObject = {};

  findObject[colorToChoseFrom] = { $gt: 0 };
  let contestantsToChoseFrom = await Attendee.find(findObject);
  let attendeeListDemocratic = [];

  let currentContestant;
  for (let i = 0; i < contestantsToChoseFrom.length; i++) {
    currentContestant = contestantsToChoseFrom[i];
    for (let y = 0; y < currentContestant[colorToChoseFrom]; y++) {
      attendeeListDemocratic.push({
        name: currentContestant.name,
        phoneNumber: currentContestant.phoneNumber
      });
    }
  }

  let winner =
    attendeeListDemocratic[
      Math.floor(Math.random() * attendeeListDemocratic.length)
    ];

  io.emit("winner", { color: colorToChoseFrom, name: winner.name });

  let newWinnerElement = new VirtualWinner({
    name: winner.name,
    phoneNumber: winner.phoneNumber,
    color: colorToChoseFrom
  });

  await Attendee.remove({ name: winner.name, phoneNumber: winner.phoneNumber });

  await newWinnerElement.save();
  res.json(winner);
});

router.route("/attendees").get(async (req, res) => {
  let attendees = await Attendee.find();
  let attendeesRedacted = [];
  let attendee;
  for (let i = 0; i < attendees.length; i++) {
    attendee = attendees[i];
    attendeesRedacted.push({
      name: attendee.name,
      ballots: attendee.red + attendee.blue + attendee.yellow + attendee.green,
      red: attendee.red,
      blue: attendee.blue,
      green: attendee.green,
      yellow: attendee.yellow
    });
  }
  res.json(attendeesRedacted);
});

router.route("/attendees/secure").get(mustBeAuthenticated, async (req, res) => {
  let attendees = await Attendee.find();

  res.json(attendees);
});

router.route("/attendee").post(mustBeAuthenticated, async (req, res) => {
  const attendee = req.body;
  let red = 0;
  let blue = 0;
  let green = 0;
  let yellow = 0;
  if (attendee.randomColors) {
    let color;
    for (let i = 0; i < attendee.ballots; i++) {
      color = Math.floor(Math.random() * 4);
      switch (color) {
        case 0:
          red += 1;
          break;
        case 1:
          blue += 1;
          break;
        case 2:
          green += 1;
          break;
        case 3:
          yellow += 1;
          break;
      }
    }
  } else {
    red = attendee.red;
    blue = attendee.blue;
    yellow = attendee.yellow;
    green = attendee.green;
  }
  let newAttendee = new Attendee({
    name: attendee.name,
    red,
    blue,
    green,
    yellow,
    phoneNumber: attendee.phoneNumber
  });
  await newAttendee.save();

  io.emit("new_attendee", {});

  res.send(true);
});

module.exports = function(_io) {
  io = _io;
  return router;
};
