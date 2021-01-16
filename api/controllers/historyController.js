const path = require("path");
const historyRepository = require(path.join(__dirname, "../history"));

const all = (req, res) => {
  return historyRepository
    .all()
    .then(lotteries =>
      res.send({
        lotteries: lotteries,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch history."
      });
    });
};

const latest = (req, res) => {
  return historyRepository
    .latest()
    .then(lottery =>
      res.send({
        lottery: lottery,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch latest history."
      });
    });
};

const byDate = (req, res) => {
  let { date } = req.params;
  date = new Date(new Date(parseInt(date)).setHours(0, 0, 0, 0)).getTime();

  return historyRepository
    .byEpochDate(date)
    .then(winners =>
      res.send({
        date: date,
        winners: winners,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch history for date."
      });
    });
};

const byName = (req, res) => {
  const { name } = req.params;

  return historyRepository
    .byName(name)
    .then(lotteries =>
      res.send({
        name: name,
        lotteries: lotteries,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch history for name."
      });
    });
};

module.exports = {
  all,
  latest,
  byDate,
  byName
};
