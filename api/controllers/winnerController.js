const path = require("path");
const winnerRepository = require(path.join(__dirname, "../winner"));

const sortOptions = ["desc", "asc"];
const includeWinesOptions = ["true", "false"];

const all = (req, res) => {
  const { sort, includeWines } = req.query;

  if (sort !== undefined && !sortOptions.includes(sort)) {
    return res.status(400).send({
      message: `Sort option must be: '${sortOptions.join(", ")}'`,
      success: false
    });
  }

  if (includeWines !== undefined && !includeWinesOptions.includes(includeWines)) {
    return res.status(400).send({
      message: `includeWines option must be: '${includeWinesOptions.join(", ")}'`,
      success: false
    });
  }

  return winnerRepository
    .all(includeWines == "true")
    .then(winners =>
      res.send({
        winners: sort !== "asc" ? winners : winners.reverse(),
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch winners."
      });
    });
};

const byDate = (req, res) => {
  let { date } = req.params;

  const regexDate = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
  if (!isNaN(date)) {
    date = new Date(new Date(parseInt(date * 1000)).setHours(0, 0, 0, 0));
  } else if (regexDate.test(date)) {
    date = new Date(date);
  } else if (date !== undefined) {
    return res.status(400).send({
      message: "Invalid date parameter, allowed epoch seconds or YYYY-MM-DD.",
      success: false
    });
  }

  return winnerRepository
    .byDate(date)
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
        message: message || "Unable to fetch winner by date."
      });
    });
};

const groupByDate = (req, res) => {
  const { sort, includeWines } = req.query;

  if (sort !== undefined && !sortOptions.includes(sort)) {
    return res.status(400).send({
      message: `Sort option must be: '${sortOptions.join(", ")}'`,
      success: false
    });
  }

  if (includeWines !== undefined && !includeWinesOptions.includes(includeWines)) {
    return res.status(400).send({
      message: `includeWines option must be: '${includeWinesOptions.join(", ")}'`,
      success: false
    });
  }

  return winnerRepository
    .groupedByDate(includeWines == "true", sort)
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
        message: message || "Unable to fetch winner by date."
      });
    });
};

const latest = (req, res) => {
  return winnerRepository
    .latest()
    .then(winners =>
      res.send({
        ...winners,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch winner by date."
      });
    });
};

const byName = (req, res) => {
  const { name } = req.params;
  const { sort } = req.query;

  if (sort !== undefined && !sortOptions.includes(sort)) {
    return res.status(400).send({
      message: `Sort option must be: '${sortOptions.join(", ")}'`,
      success: false
    });
  }

  return winnerRepository
    .byName(name, sort)
    .then(winner =>
      res.send({
        winner: winner,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch winner by name."
      });
    });
};

const groupByColor = (req, res) => {
  const { includeWines } = req.query;

  if (includeWines !== undefined && !includeWinesOptions.includes(includeWines)) {
    return res.status(400).send({
      message: `includeWines option must be: '${includeWinesOptions.join(", ")}'`,
      success: false
    });
  }

  return winnerRepository
    .groupByColor(includeWines == "true")
    .then(colors =>
      res.send({
        colors: colors,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch winners by color."
      });
    });
};

const orderByWins = (req, res) => {
  const { includeWines } = req.query;

  if (includeWines !== undefined && !includeWinesOptions.includes(includeWines)) {
    return res.status(400).send({
      message: `includeWines option must be: '${includeWinesOptions.join(", ")}'`,
      success: false
    });
  }

  return winnerRepository
    .orderByWins(includeWines == "true")
    .then(winners =>
      res.send({
        winners: winners,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch winners by color."
      });
    });
};

module.exports = {
  all,
  byDate,
  groupByDate,
  latest,
  byName,
  groupByColor,
  orderByWins
};
