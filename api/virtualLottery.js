const express = require("express");
const path = require("path");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});
let io;
const mustBeAuthenticated = require(path.join(
  __dirname + "/../middleware/mustBeAuthenticated"
));
const config = require(path.join(__dirname + "/../config/defaults/lottery"));

const Attendee = require(path.join(__dirname + "/../schemas/Attendee"));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));

const Message = require(path.join(__dirname + "/../api/message"));

const removeWinners = async (req, res) => {
  await VirtualWinner.deleteMany();
  io.emit("refresh_data", {});
  return res.json(true);
};

const deleteAttendees = req, res) => {
  await Attendee.deleteMany();
  io.emit("refresh_data", {});
  return res.json(true);
};

const winners = async (req, res) => {
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
};

const winnersSecure = async (req, res) => {
  let winners = await VirtualWinner.find();

  return res.json(winners);
});

const winner = async (req, res) => {
  let allContestants = await Attendee.find({ winner: false });
  if (allContestants.length == 0) {
    return res.json(false);
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

  ballotColors = shuffle(ballotColors);

  let colorToChooseFrom =
    ballotColors[Math.floor(Math.random() * ballotColors.length)];
  let findObject = { winner: false };

  findObject[colorToChooseFrom] = { $gt: 0 };

  let tries = 0;
  const maxTries = 3;
  let contestantsToChooseFrom = undefined;
  while (contestantsToChooseFrom == undefined && tries < maxTries) {
    const hit = await Attendee.find(findObject);
    if (hit && hit.length) {
      contestantsToChooseFrom = hit;
      break;
    }
    tries++;
  }
  if (contestantsToChooseFrom == undefined) {
    return res.status(404).send({
      success: false,
      message: `Klarte ikke trekke en vinner etter ${maxTries} forsøk.`
    });
  }

  let attendeeListDemocratic = [];

  let currentContestant;
  for (let i = 0; i < contestantsToChooseFrom.length; i++) {
    currentContestant = contestantsToChooseFrom[i];
    for (let y = 0; y < currentContestant[colorToChooseFrom]; y++) {
      attendeeListDemocratic.push({
        name: currentContestant.name,
        phoneNumber: currentContestant.phoneNumber,
        red: currentContestant.red,
        blue: currentContestant.blue,
        green: currentContestant.green,
        yellow: currentContestant.yellow
      });
    }
  }

  attendeeListDemocratic = shuffle(attendeeListDemocratic);

  let winner =
    attendeeListDemocratic[
      Math.floor(Math.random() * attendeeListDemocratic.length)
    ];

  io.emit("winner", { color: colorToChooseFrom, name: winner.name });

  let newWinnerElement = new VirtualWinner({
    name: winner.name,
    phoneNumber: winner.phoneNumber,
    color: colorToChooseFrom,
    red: winner.red,
    blue: winner.blue,
    green: winner.green,
    yellow: winner.yellow,
    id: sha512(winner.phoneNumber, genRandomString(10)),
    timestamp_drawn: new Date().getTime()
  });

  await Attendee.update(
    { name: winner.name, phoneNumber: winner.phoneNumber },
    { $set: { winner: true } }
  );

  await newWinnerElement.save();
  return res.json(winner);
};

const genRandomString = function(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

const sha512 = function(password, salt) {
  var hash = crypto.createHmac("md5", salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest("hex");
  return value;
};

const finish = async (req, res) => {
  if (!config.gatewayToken) {
    return res.json(false);
  }
  let winners = await VirtualWinner.find({ timestamp_sent: undefined }).sort({
    timestamp_drawn: 1
  });

  if (winners.length == 0) {
    return res.json(false);
  }

  let firstWinner = winners[0];
  messageSent = false;
  try {
    let messageSent = await Message.sendMessage(firstWinner);
    Message.sendUpdate(winners.slice(1));
    if (!messageSent) {
      return res.json(false);
    }
  } catch (e) {
    return res.json(false);
  }

  firstWinner.timestamp_sent = new Date().getTime();
  firstWinner.timestamp_limit = new Date().getTime() + 600000;

  await firstWinner.save();
  startTimeout(firstWinner.id);
  return res.json(true);
};

const attendees = async (req, res) => {
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
  return res.json(attendeesRedacted);
};

const attendeesSecure = async (req, res) => {
  let attendees = await Attendee.find();

  return res.json(attendees);
});

return addAttendee = async (req, res) => {
  const attendee = req.body;
  const { red, blue, yellow, green } = attendee;

  let newAttendee = new Attendee({
    name: attendee.name,
    red,
    blue,
    green,
    yellow,
    phoneNumber: attendee.phoneNumber,
    winner: false
  });
  await newAttendee.save();

  io.emit("new_attendee", {});

  return res.send(true);
});

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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
    } else {
      nextWinner[0].timestamp_sent = new Date().getTime();
      nextWinner[0].timestamp_limit = new Date().getTime() + 600000;
      await nextWinner[0].save();
      Message.sendMessage(nextWinner[0]);
      startTimeout(nextWinner[0].id); 
    }
    
  }, 600000);
}

module.exports = {
  removeWinners,
  deleteAttendees,
  winners,
  winnersSecure,
  winner,
  finish,
  attendees,
  attendeesSecure,
  addAttendee
}

