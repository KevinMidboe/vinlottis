const path = require("path");
const crypto = require("crypto");

const Attendee = require(path.join(__dirname, "/schemas/Attendee"));
const PreLotteryWine = require(path.join(__dirname, "/schemas/PreLotteryWine"));
const VirtualWinner = require(path.join(__dirname, "/schemas/VirtualWinner"));
const Lottery = require(path.join(__dirname, "/schemas/Purchase"));

const Message = require(path.join(__dirname, "/message"));
const historyRepository = require(path.join(__dirname, "/history"));
const wineRepository = require(path.join(__dirname, "/wine"));

const {
  WinnerNotFound,
  NoMoreAttendeesToWin,
  CouldNotFindNewWinnerAfterNTries,
  LotteryByDateNotFound
} = require(path.join(__dirname, "/vinlottisErrors"));

const archive = (date, raffles, stolen, wines) => {
  const { blue, red, yellow, green } = raffles;
  const bought = blue + red + yellow + green;

  return Promise.all(wines.map(wine => wineRepository.findWine(wine))).then(resolvedWines => {
    const lottery = new Lottery({
      date,
      blue,
      red,
      yellow,
      green,
      bought,
      stolen,
      wines: resolvedWines
    });

    return lottery.save();
  });
};

const lotteryByDate = date => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(24, 59, 59, 99));

  const query = [
    {
      $match: {
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $lookup: {
        from: "wines",
        localField: "wines",
        foreignField: "_id",
        as: "wines"
      }
    }
  ];

  const aggregateLottery = Lottery.aggregate(query);
  return aggregateLottery.project("-_id -__v").then(lotteries => {
    if (lotteries.length == 0) {
      throw new LotteryByDateNotFound(date);
    }
    return lotteries[0];
  });
};

const allLotteries = (sort = "asc", yearFilter = undefined) => {
  const sortDirection = sort == "asc" ? 1 : -1;

  let startQueryDate = new Date("1970-01-01");
  let endQueryDate = new Date("2999-01-01");
  if (yearFilter) {
    startQueryDate = new Date(`${yearFilter}-01-01`);
    endQueryDate = new Date(`${Number(yearFilter) + 1}-01-01`);
  }

  const query = [
    {
      $match: {
        date: {
          $gte: startQueryDate,
          $lte: endQueryDate
        }
      }
    },
    {
      $sort: {
        date: sortDirection
      }
    },
    {
      $unset: ["_id", "__v"]
    },
    {
      $lookup: {
        from: "wines",
        localField: "wines",
        foreignField: "_id",
        as: "wines"
      }
    }
  ];

  return Lottery.aggregate(query);
};

const allLotteriesIncludingWinners = async (sort = "asc", yearFilter = undefined) => {
  const lotteries = await allLotteries(sort, yearFilter);
  const allWinners = await historyRepository.groupByDate(false, sort);

  return lotteries.map(lottery => {
    const { winners } = allWinners.pop();

    return {
      wines: lottery.wines,
      date: lottery.date,
      blue: lottery.blue,
      green: lottery.green,
      yellow: lottery.yellow,
      red: lottery.red,
      bought: lottery.bought,
      stolen: lottery.stolen,
      winners: winners
    };
  });
};

const drawWinner = async () => {
  let allContestants = await Attendee.find({ winner: false });

  if (allContestants.length == 0) {
    throw new NoMoreAttendeesToWin();
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
    throw new CouldNotFindNewWinnerAfterNTries(maxTries);
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

  let winners = await VirtualWinner.find({ timestamp_sent: undefined }).sort({
    timestamp_drawn: 1
  });

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
  drawWinner,
  archive,
  lotteryByDate,
  allLotteries,
  allLotteriesIncludingWinners
};
