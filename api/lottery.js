const path = require('path');

const Highscore = require(path.join(__dirname + '/../schemas/Highscore'));
const Wine = require(path.join(__dirname + '/../schemas/Wine'));

// Utils
const epochToDateString = date => new Date(parseInt(date)).toDateString();

const getHighscoreByDates = highscore => {
  let groupedLotteries = {}

  highscore.forEach(user => {
    user.wins.map(win => {
      const epochDate = new Date(win.date).setHours(0,0,0,0);
      const obj = {
        name: user.name,
        color: win.color,
        wine: win.wine,
        date: epochDate
      }

      groupedLotteries[epochDate] ?
        groupedLotteries[epochDate].push(obj) : groupedLotteries[epochDate] = [obj];
    })
  })

  return groupedLotteries
}

const groupedHighscoreToSortedList = groupedLotteries => {
  return Object.keys(groupedLotteries).map(key => {
    const winners = groupedLotteries[key];
    return {
      date: parseInt(key),
      dateString: epochToDateString(key),
      winners
    }
  }).sort((a,b) => parseInt(a.date) > parseInt(b.date) ? 1 : -1) 
}

const resolveWineReferences = listWithWines => {
  return Promise.all(listWithWines.map(element =>
    Wine.findById(element.wine)
      .then(wine => {
        element.wine = wine
        return element
      })
  ))
}

// Routes
const all = (req, res) => {
  return Highscore.find()
    .then(highscore => getHighscoreByDates(highscore))
    .then(groupedLotteries => groupedHighscoreToSortedList(groupedLotteries))
    .then(lotteries => res.send({
      message: "Lotteries by date!",
      lotteries
    }))
}

const latest = (req, res) => {
  return Highscore.find()
    .then(highscore => getHighscoreByDates(highscore))
    .then(groupedLotteries => groupedHighscoreToSortedList(groupedLotteries))
    .then(lotteries => res.send({
      message: "Latest lottery!",
      lottery: lotteries.slice(-1).pop()
    }))
}

const byEpochDate = (req, res) => {
  const { date } = req.params;
  const dateString = epochToDateString(date);

  return Highscore.find()
    .then(highscore => getHighscoreByDates(highscore))
    .then(async (lotteries) => {
      const lottery = lotteries[date];
      let highscoreWithResolvedWines = await resolveWineReferences(lottery)
      highscoreWithResolvedWines = highscoreWithResolvedWines.reverse()

      if (lottery != null) {
        return res.send({
          message: `Lottery for date: ${dateString}`,
          lottery: highscoreWithResolvedWines
        })
      } else {
        return res.status(404).send({
          message: `No lottery found for date: ${dateString}`
        })
      }
    })
}

const byName = (req, res) => {
  const { name } = req.params;
  const regexName = new RegExp(name, "i"); // lowercase regex of the name

  return Highscore.find({ "name": { $regex : regexName } })
    .then(async (highscore) => {
      highscore = highscore[0]
      if (highscore) {
        let highscoreWithResolvedWines = await resolveWineReferences(highscore.wins)
        highscoreWithResolvedWines = highscoreWithResolvedWines.reverse()

        return res.send({
          message: `Lottery winnings by name: ${name}`,
          name: name,
          highscore: highscoreWithResolvedWines
         })
      } else {
        return res.status(404).send({
          message: `Name: ${ name } not found in leaderboards.`
        })
      }
    })
}

module.exports = {
  all,
  latest,
  byEpochDate,
  byName
};
