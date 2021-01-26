const path = require("path");
const winnerRepository = require(path.join(__dirname, "../winner"));

const addWinners = (req, res) => {
  const { winners } = req.body;

  if (!(winners instanceof Array)) {
    return res.status(400).send({
      message: "Winners must be array.",
      success: false
    });
  }

  const requiredAttributes = ["name", "color"];
  const validColors = ["red", "blue", "green", "yellow"];
  const validateAllWinners = winners =>
    winners.map(winner => {
      return Promise.all(
        requiredAttributes.map(attr => {
          if (typeof winner[attr] === "undefined") {
            return Promise.reject({
              message: `Incorrect or missing attribute: ${attr}.`,
              statusCode: 400
            });
          }

          if (!validColors.includes(winner.color)) {
            return Promise.reject({
              message: `Missing or incorrect color value, must have one of values: ${validColors.join(", ")}.`,
              statusCode: 400
            });
          }

          return Promise.resolve();
        })
      ).then(_ => Promise.resolve(winner));
    });

  return Promise.all(validateAllWinners(winners))
    .then(winners => winnerRepository.addWinners(winners))
    .then(winners =>
      res.send({
        winners: winners,
        message: `Successfully added winners to lottery.`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured adding winners.",
        success: false
      });
    });
};

const allWinners = (req, res) => {
  const isAdmin = req.isAuthenticated() || true;

  return winnerRepository
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
  const isAdmin = req.isAuthenticated();

  return winnerRepository
    .winnerById(id, isAdmin)
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
  const isAdmin = req.isAuthenticated();
  const { id } = req.params;

  return winnerRepository
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
  return winnerRepository
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
  addWinners,
  allWinners,
  winnerById,
  deleteWinnerById,
  deleteWinners
};
