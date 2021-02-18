const path = require("path");

const prizeDistribution = require(path.join(__dirname, "../prizeDistribution"));
const winner = require(path.join(__dirname, "../winner"));
const message = require(path.join(__dirname, "../message"));

const start = async (req, res) => {
  const allWinners = await winners.allWinners();
  if (allWinners.length === 0) {
    return res.status(503).send({
      message: "No winners left.",
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

  const winner = await prizeDistribution.verifyWinnerNextInLine(id);
  const prelotteryWine = await lottery.wineById(wine.id);

  return prizeDistribution
    .claimPrize(winner, prelotteryWine)
    .then(_ => prizeDistribution.notifyNextWinner())
    .then(_ =>
      res.send({
        message: `${winner.name} successfully claimed prize: ${wine.name}`,
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
