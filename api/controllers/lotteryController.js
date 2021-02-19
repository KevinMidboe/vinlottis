const path = require("path");
const lotteryRepository = require(path.join(__dirname, "../lottery"));

const drawWinner = (req, res) => {
  return lotteryRepository
    .drawWinner()
    .then(({ winner, color, winners }) => {
      var io = req.app.get("socketio");
      io.emit("winner", {
        color: color,
        name: winner.name,
        winner_count: winners.length + 1
      });

      return { winner, color, winners };
    })
    .then(({ winner, color, winners }) =>
      res.send({
        color: color,
        winner: winner,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while drawing winner.",
        success: false
      });
    });
};

const archiveLottery = (req, res) => {
  const { lottery } = req.body;
  if (lottery == undefined || !lottery instanceof Object) {
    return res.status(400).send({
      message: "Missing lottery object.",
      success: false
    });
  }

  let { stolen, date, raffles, wines } = lottery;
  stolen = stolen !== undefined ? stolen : 0; // default = 0

  const validDateFormat = new RegExp("d{4}-d{2}-d{2}");
  if (date != undefined && (!validDateFormat.test(date) || isNaN(date))) {
    return res.status(400).send({
      message: "Date must be defined as 'yyyy-mm-dd'.",
      success: false
    });
  } else if (date != undefined) {
    date = Date.parse(date, "yyyy-MM-dd");
  } else {
    date = new Date();
  }

  return verifyLotteryPayload(raffles, stolen, wines)
    .then(_ => lotteryRepository.archive(date, raffles, stolen, wines))
    .then(_ =>
      res.send({
        message: "Successfully archive lottery",
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while submitting lottery.",
        success: false
      });
    });
};

const lotteryByDate = (req, res) => {
  const { epoch } = req.params;

  if (!/^\d+$/.test(epoch)) {
    return res.status(400).send({
      message: "Last parameter must be epoch (in seconds).",
      success: false
    });
  }
  const date = new Date(Number(epoch) * 1000);

  return lotteryRepository
    .lotteryByDate(date)
    .then(lottery =>
      res.send({
        lottery,
        message: `Lottery for date: ${dateToDateString(date)}/${epoch}.`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetching lottery by date.",
        success: false
      });
    });
};

const sortOptions = ["desc", "asc"];
const allLotteries = (req, res) => {
  let { includeWinners, year, sort } = req.query;

  if (sort !== undefined && !sortOptions.includes(sort)) {
    return res.status(400).send({
      message: `Sort option must be: '${sortOptions.join(", ")}'`,
      success: false
    });
  } else if (sort === undefined) {
    sort = "asc";
  }

  let allLotteriesFunction = lotteryRepository.allLotteries;
  if (includeWinners === "true") {
    allLotteriesFunction = lotteryRepository.allLotteriesIncludingWinners;
  }

  return allLotteriesFunction(sort, year)
    .then(lotteries =>
      res.send({
        lotteries,
        message: "All lotteries.",
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetching all lotteries.",
        success: false
      });
    });
};

function verifyLotteryPayload(raffles, stolen, wines) {
  return new Promise((resolve, reject) => {
    if (raffles == undefined || !raffles instanceof Array) {
      reject({
        message: "Raffles must be array.",
        status: 400
      });
    }

    const requiredColors = [raffles["red"], raffles["blue"], raffles["green"], raffles["yellow"]];
    const correctColorsTypes = requiredColors.filter(color => typeof color === "number");
    if (requiredColors.length !== correctColorsTypes.length) {
      reject({
        message:
          "Incorrect or missing raffle colors, required type Number for keys: 'blue', 'red', 'green' & 'yellow'.",
        status: 400
      });
    }

    if (stolen == undefined || (isNaN(stolen) && stolen >= 0)) {
      reject({
        message: "Number of stolen raffles must be positive integer or 0.",
        status: 400
      });
    }

    if (wines == undefined || !wines instanceof Array) {
      reject({
        message: "Wines must be array.",
        status: 400
      });
    }

    resolve();
  });
}

function dateToDateString(date) {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${ye}-${mo}-${da}`;
}

module.exports = {
  drawWinner,
  archiveLottery,
  lotteryByDate,
  allLotteries
};
