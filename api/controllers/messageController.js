const path = require("path");
const messageRepository = require(path.join(__dirname, "../message"));
const winnerRepository = require(path.join(__dirname, "../winner"));

const notifyWinnerById = (req, res) => {
  const { id } = req.params;
  const isAdmin = req.isAuthenticated();

  return winnerRepository
    .winnerById(id, isAdmin)
    .then(winner => messageRepository.sendPrizeSelectionLink(winner))
    .then(messageResponse =>
      res.send({
        messageResponse,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while sending message to winner by id.",
        success: false
      });
    });
};

module.exports = {
  notifyWinnerById
};
