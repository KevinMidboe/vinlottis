const path = require("path");

const Highscore = require(path.join(__dirname, "/schemas/Highscore"));
const Wine = require(path.join(__dirname, "/schemas/Wine"));

class HistoryByDateNotFound extends Error {
  constructor(message = "History for given date not found.") {
    super(message);
    this.name = "HistoryByDateNotFound";
    this.statusCode = 404;
  }
}

class HistoryForUserNotFound extends Error {
  constructor(message = "History for given user not found.") {
    super(message);
    this.name = "HistoryForUserNotFound";
    this.statusCode = 404;
  }
}

// Utils
const epochToDateString = date => new Date(parseInt(date)).toDateString();

const sortNewestFirst = lotteries => {
  return lotteries.sort((a, b) => (parseInt(a.date) < parseInt(b.date) ? 1 : -1));
};

const groupHighscoreByDate = async (highscore = undefined) => {
  if (highscore == undefined) highscore = await Highscore.find();

  const highscoreByDate = [];

  highscore.forEach(person => {
    person.wins.map(win => {
      const epochDate = new Date(win.date).setHours(0, 0, 0, 0);
      const winnerObject = {
        name: person.name,
        color: win.color,
        wine: win.wine,
        date: epochDate
      };

      const existingDateIndex = highscoreByDate.findIndex(el => el.date == epochDate);
      if (existingDateIndex > -1) highscoreByDate[existingDateIndex].winners.push(winnerObject);
      else
        highscoreByDate.push({
          date: epochDate,
          winners: [winnerObject]
        });
    });
  });

  return sortNewestFirst(highscoreByDate);
};

const resolveWineReferences = (highscoreObject, key) => {
  const listWithWines = highscoreObject[key];

  return Promise.all(
    listWithWines.map(element =>
      Wine.findById(element.wine).then(wine => {
        element.wine = wine;
        return element;
      })
    )
  ).then(resolvedListWithWines => {
    highscoreObject[key] = resolvedListWithWines;
    return highscoreObject;
  });
};
// end utils

// Routes
const all = () => {
  return Highscore.find().then(highscore => groupHighscoreByDate(highscore));
};

const latest = () => {
  return groupHighscoreByDate()
    .then(lotteries => lotteries.shift()) // first element in list
    .then(latestLottery => resolveWineReferences(latestLottery, "winners"));
};

const byEpochDate = date => {
  return groupHighscoreByDate()
    .then(lotteries => {
      const lottery = lotteries.filter(lottery => lottery.date == date);
      if (lottery.length > 0) {
        return lottery[0];
      } else {
        throw new HistoryByDateNotFound();
      }
    })
    .then(lottery => resolveWineReferences(lottery, "winners"))
    .then(lottery => lottery.winners);
};

const byName = name => {
  return Highscore.find({ name })
    .then(highscore => {
      if (highscore.length > 0) {
        return highscore[0];
      } else {
        throw new HistoryForUserNotFound();
      }
    })
    .then(highscore => resolveWineReferences(highscore, "wins"))
    .then(highscore => sortNewestFirst(highscore.wins));
};

module.exports = {
  all,
  latest,
  byEpochDate,
  byName
};
