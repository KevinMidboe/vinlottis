const path = require("path");
const lotteryRepository = require(path.join(__dirname, "../lottery"));

const allWinners = (req, res) => {
  const isAdmin = req.isAuthenticated() || true;

  return lotteryRepository
    .allWinners(isAdmin)
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
        message: message || "Unable to fetch lottery winners."
      });
    });
};

const winnerById = (req, res) => {
  const { id } = req.params;

  return lotteryRepository
    .winnerById(id)
    .then(winner =>
      res.send({
        winner,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured, unable to fetch winner by id.",
        success: false
      });
    });
};

const deleteWinnerById = (req, res) => {
  const isAdmin = req.isAuthenticated() || true;
  const { id } = req.params;

  return lotteryRepository
    .deleteWinnerById(id, isAdmin)
    .then(removedWinner => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
      return removedWinner;
    })
    .then(winner =>
      res.send({
        message: `Removed winner: ${winner.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleteing wine by id.",
        success: false
      });
    });
};

const deleteWinners = (req, res) => {
  return lotteryRepository
    .deleteWinners()
    .then(_ => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
    })
    .then(_ =>
      res.send({
        message: "Removed all winners.",
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleting wines",
        success: false
      });
    });
};

module.exports = {
  allWinners,
  winnerById,
  deleteWinnerById,
  deleteWinners
};
