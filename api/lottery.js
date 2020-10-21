const path = require('path');

const Highscore = require(path.join(__dirname + '/../schemas/Highscore'));
const Wine = require(path.join(__dirname + '/../schemas/Wine'));

// Utils
const epochToDateString = date => new Date(parseInt(date)).toDateString();

const sortNewestFirst = (lotteries) => {
  return lotteries.sort((a, b) => parseInt(a.date) < parseInt(b.date) ? 1 : -1)
}

const groupHighscoreByDate = async (highscore=undefined) => {
  if (highscore == undefined)
    highscore = await Highscore.find();

  const highscoreByDate = [];

  highscore.forEach(person => {
    person.wins.map(win => {
      const epochDate = new Date(win.date).setHours(0,0,0,0);
      const winnerObject = {
        name: person.name,
        color: win.color,
        wine: win.wine,
        date: epochDate
      }

      const existingDateIndex = highscoreByDate.findIndex(el => el.date == epochDate)
      if (existingDateIndex > -1)
        highscoreByDate[existingDateIndex].winners.push(winnerObject);
      else
        highscoreByDate.push({
          date: epochDate,
          winners: [winnerObject]
        })
    })
  })

  return sortNewestFirst(highscoreByDate);
}

const resolveWineReferences = (highscoreObject, key) => {
  const listWithWines = highscoreObject[key]

  return Promise.all(listWithWines.map(element =>
      Wine.findById(element.wine)
        .then(wine => {
          element.wine = wine
          return element
        }))
    )
    .then(resolvedListWithWines => {
      highscoreObject[key] = resolvedListWithWines;
      return highscoreObject
    })
}
// end utils

// Routes
const all = (req, res) => {
  return Highscore.find()
    .then(highscore => groupHighscoreByDate(highscore))
    .then(lotteries => res.send({
      message: "Lotteries by date!",
      lotteries
    }))
}

const latest = (req, res) => {
  return groupHighscoreByDate()
    .then(lotteries => lotteries.shift()) // first element in list
    .then(latestLottery => resolveWineReferences(latestLottery, "winners"))
    .then(lottery => res.send({
        message: "Latest lottery!",
        winners: lottery.winners
      })
    )
}

const byEpochDate = (req, res) => {
  let { date } = req.params;
  date = new Date(new Date(parseInt(date)).setHours(0,0,0,0)).getTime()
  const dateString = epochToDateString(date);

  return groupHighscoreByDate()
    .then(lotteries => {
      const lottery = lotteries.filter(lottery => lottery.date == date)
      if (lottery.length > 0) {
        return lottery[0]
      } else {
        return res.status(404).send({
          message: `No lottery found for date: ${ dateString }`
        })
      }
    })
    .then(lottery => resolveWineReferences(lottery, "winners"))
    .then(lottery => res.send({
      message: `Lottery for date: ${ dateString}`,
      date,
      winners: lottery.winners
    }))
}

const byName = (req, res) => {
  const { name } = req.params;
  const regexName = new RegExp(name, "i"); // lowercase regex of the name

  return Highscore.find({ name })
    .then(highscore => {
      if (highscore.length > 0) {
        return highscore[0]
      } else {
        return res.status(404).send({
          message: `Name: ${ name } not found in leaderboards.`
        })
      }
    })
    .then(highscore => resolveWineReferences(highscore, "wins"))
    .then(highscore => res.send({
      message: `Lottery winnings for name: ${ name }.`,
      name: highscore.name,
      highscore: sortNewestFirst(highscore.wins)
    }))
}

module.exports = {
  all,
  latest,
  byEpochDate,
  byName
};
