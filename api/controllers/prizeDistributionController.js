const path = require("path");

const prizeDistribution = require(path.join(__dirname, "../prizeDistribution"));
const prelotteryWineRepository = require(path.join(__dirname, "../prelotteryWine"));
const winnerRepository = require(path.join(__dirname, "../winner"));
const message = require(path.join(__dirname, "../message"));
const logger = require(`${__base}/logger`);

const start = async (req, res) => {
  const allWinners = await winnerRepository.allWinners(true);
  if (allWinners.length === 0) {
    return res.status(503).send({
      message: "No winners found to distribute prizes to.",
      success: false
    });
  }

  const laterWinners = allWinners.slice(1);

  return prizeDistribution
    .notifyNextWinner()
    .then(_ => message.sendInitialMessageToWinners(laterWinners))
    .then(_ =>
      res.send({
        message: `Send link to first winner and notified everyone else.`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      logger.error(error)
      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while starting prize distribution.",
        success: false
      });
    });
};

const getPrizesForWinnerById = (req, res) => {
  const { id } = req.params;

  return prizeDistribution
    .verifyWinnerNextInLine(id)
    .then(winner => {
      return prelotteryWineRepository.allWinesWithoutWinner().then(wines => [wines, winner]);
    })
    .then(([wines, winner]) =>
      res.send({
        wines: wines,
        winner: winner,
        message: "Wines to select from",
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetching prizes.",
        success: false
      });
    });
};

const submitPrizeForWinnerById = async (req, res) => {
  const { id } = req.params;
  const { wine } = req.body;

  let prelotteryWine, winner;
  try {
    prelotteryWine = await prelotteryWineRepository.wineById(wine._id);
    winner = await winnerRepository.winnerById(id, true);
  } catch (error) {
    const { statusCode, message } = error;

    return res.status(statusCode || 500).send({
      message: message || "Unexpected error occured while claiming prize.",
      success: false
    });
  }

  return prizeDistribution
    .claimPrize(prelotteryWine, winner)
    .then(_ => prizeDistribution.notifyNextWinner())
    .then(_ =>
      res.send({
        message: `${winner.name} successfully claimed prize: ${prelotteryWine.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while claiming prize.",
        success: false
      });
    });
};

module.exports = {
  start,
  getPrizesForWinnerById,
  submitPrizeForWinnerById
};
