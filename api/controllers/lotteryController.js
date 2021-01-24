const path = require("path");
const lotteryRepository = require(path.join(__dirname, "../lottery"));

const allAttendees = (req, res) => {
  const isAdmin = req.isAuthenticated();

  return lotteryRepository
    .allAttendees(isAdmin === "true")
    .then(attendees =>
      res.send({
        attendees: attendees,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch lottery attendees."
      });
    });
};

const deleteAttendees = (req, res) => {
  return lotteryRepository.deleteAttendees().then(success =>
    res.send({
      message: "Removed all attendees",
      success: success
    })
  );
};

module.exports = {
  allAttendees,
  deleteAttendees
};
