const path = require("path");

const Attendee = require(path.join(__dirname, "/schemas/Attendee"));
const PreLotteryWine = require(path.join(__dirname, "/schemas/PreLotteryWine"));
const VirtualWinner = require(path.join(__dirname, "/schemas/VirtualWinner"));

const crypto = require("crypto");

class UserNotFound extends Error {
  constructor(message = "User not found.") {
    super(message);
    this.name = "UserNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WineNotFound extends Error {
  constructor(message = "Wine not found.") {
    super(message);
    this.name = "WineNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WinnerNotFound extends Error {
  constructor(message = "Winner not found.") {
    super(message);
    this.name = "WinnerNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class NoMoreAttendeesToWinError extends Error {
  constructor(message = "No more attendees left to drawn from.") {
    super(message);
    this.name = "NoMoreAttendeesToWinError";
    this.statusCode = 404;
  }
}

class CouldNotFindNewWinnerAfterNTriesError extends Error {
  constructor(tries) {
    let message = `Could not a new winner after ${tries} tries.`;
    super(message);
    this.name = "CouldNotFindNewWinnerAfterNTriesError";
    this.statusCode = 404;
  }
}

const redactAttendeeInfoMapper = attendee => {
  return {
    name: attendee.name,
    raffles: attendee.red + attendee.blue + attendee.yellow + attendee.green,
    red: attendee.red,
    blue: attendee.blue,
    green: attendee.green,
    yellow: attendee.yellow
  };
};

const redactWinnerInfoMapper = winner => {
  return {
    name: winner.name,
    color: winner.color
  };
};

const allAttendees = (isAdmin = false) => {
  if (!isAdmin) {
    return Attendee.find().then(attendees => attendees.map(redactAttendeeInfoMapper));
  } else {
    return Attendee.find();
  }
};

const addAttendee = attendee => {
  const { name, red, blue, green, yellow, phoneNumber } = attendee;

  let newAttendee = new Attendee({
    name,
    red,
    blue,
    green,
    yellow,
    phoneNumber,
    winner: false
  });

  return newAttendee.save();
};

const updateAttendeeById = (id, updateModel) => {
  return Attendee.findOne({ _id: id }).then(attendee => {
    if (attendee == null) {
      throw new UserNotFound();
    }

    const updatedAttendee = {
      name: updateModel.name != null ? updateModel.name : attendee.name,
      green: updateModel.green != null ? updateModel.green : attendee.green,
      red: updateModel.red != null ? updateModel.red : attendee.red,
      blue: updateModel.blue != null ? updateModel.blue : attendee.blue,
      yellow: updateModel.yellow != null ? updateModel.yellow : attendee.yellow,
      phoneNumber: updateModel.phoneNumber != null ? updateModel.phoneNumber : attendee.phoneNumber,
      winner: updateModel.winner != null ? updateModel.winner : attendee.winner
    };

    return Attendee.updateOne({ _id: id }, updatedAttendee).then(_ => updatedAttendee);
  });
};

const deleteAttendeeById = id => {
  return Attendee.findOne({ _id: id }).then(attendee => {
    if (attendee == null) {
      throw new UserNotFound();
    }

    return Attendee.deleteOne({ _id: id }).then(_ => attendee);
  });
};

const deleteAttendees = () => {
  return Attendee.deleteMany();
};

const allWines = () => {
  return PreLotteryWine.find();
};

const addWines = wines => {
  const prelotteryWines = wines.map(wine => {
    let newPrelotteryWine = new PreLotteryWine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: wine.rating,
      image: wine.image,
      price: wine.price,
      country: wine.country,
      id: wine.id
    });

    return newPrelotteryWine.save();
  });

  return Promise.all(prelotteryWines);
};

const updateWineById = (id, updateModel) => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    const updatedWine = {
      name: updateModel.name != null ? updateModel.name : wine.name,
      vivinoLink: updateModel.vivinoLink != null ? updateModel.vivinoLink : wine.vivinoLink,
      rating: updateModel.rating != null ? updateModel.rating : wine.rating,
      image: updateModel.image != null ? updateModel.image : wine.image,
      price: updateModel.price != null ? updateModel.price : wine.price,
      country: updateModel.country != null ? updateModel.country : wine.country,
      id: updateModel.id != null ? updateModel.id : wine.id
    };

    return PreLotteryWine.updateOne({ _id: id }, updatedWine).then(_ => updatedWine);
  });
};

const deleteWineById = id => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    return PreLotteryWine.deleteOne({ _id: id }).then(_ => wine);
  });
};

const deleteWines = () => {
  return PreLotteryWine.deleteMany();
};

const addWinners = winners => {
  return Promise.all(
    winners.map(winner => {
      let newWinnerElement = new VirtualWinner({
        name: winner.name,
        color: winner.color,
        timestamp_drawn: new Date().getTime()
      });

      return newWinnerElement.save();
    })
  );
};

const allWinners = (isAdmin = false) => {
  if (!isAdmin) {
    return VirtualWinner.find().then(winners => winners.map(redactWinnerInfoMapper));
  } else {
    return VirtualWinner.find();
  }
};

const winnerById = (id, isAdmin = false) => {
  return VirtualWinner.findOne({ _id: id }).then(winner => {
    if (winner == null) {
      throw new WinnerNotFound();
    }

    if (!isAdmin) {
      return redactWinnerInfoMapper(winner);
    } else {
      return winner;
    }
  });
};

const deleteWinnerById = id => {
  return VirtualWinner.findOne({ _id: id }).then(winner => {
    if (winner == null) {
      throw new WinnerNotFound();
    }

    return VirtualWinner.deleteOne({ _id: id }).then(_ => winner);
  });
};

const deleteWinners = () => {
  return VirtualWinner.deleteMany();
};

const drawWinner = async () => {
  let allContestants = await Attendee.find({ winner: false });

  if (allContestants.length == 0) {
    throw new NoMoreAttendeesToWinError();
  }

  let raffleColors = [];
  for (let i = 0; i < allContestants.length; i++) {
    let currentContestant = allContestants[i];
    for (let blue = 0; blue < currentContestant.blue; blue++) {
      raffleColors.push("blue");
    }
    for (let red = 0; red < currentContestant.red; red++) {
      raffleColors.push("red");
    }
    for (let green = 0; green < currentContestant.green; green++) {
      raffleColors.push("green");
    }
    for (let yellow = 0; yellow < currentContestant.yellow; yellow++) {
      raffleColors.push("yellow");
    }
  }

  raffleColors = shuffle(raffleColors);

  let colorToChooseFrom = raffleColors[Math.floor(Math.random() * raffleColors.length)];
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
    throw new CouldNotFindNewWinnerAfterNTriesError(maxTries);
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

  let winner = attendeeListDemocratic[Math.floor(Math.random() * attendeeListDemocratic.length)];

  let winners = await VirtualWinner.find({ timestamp_sent: undefined }).sort({
    timestamp_drawn: 1
  });

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

  await newWinnerElement.save();
  await Attendee.updateOne({ name: winner.name, phoneNumber: winner.phoneNumber }, { $set: { winner: true } });

  return { winner, color: colorToChooseFrom, winners };
};

/** - - UTILS - - **/
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

module.exports = {
  allAttendees,
  addAttendee,
  updateAttendeeById,
  deleteAttendeeById,
  deleteAttendees,
  allWines,
  addWines,
  updateWineById,
  deleteWineById,
  deleteWines,
  addWinners,
  allWinners,
  winnerById,
  deleteWinnerById,
  deleteWinners,
  drawWinner
};
