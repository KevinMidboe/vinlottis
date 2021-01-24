const path = require("path");
const lotteryRepository = require(path.join(__dirname, "../lottery"));

const allAttendees = (req, res) => {
  const isAdmin = req.isAuthenticated();

  return lotteryRepository
    .allAttendees(isAdmin)
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

const addAttendee = (req, res) => {
  const { attendee } = req.body;

  const requiredColors = [attendee["red"], attendee["blue"], attendee["green"], attendee["yellow"]];
  const correctColorsTypes = requiredColors.filter(color => typeof color === "number");
  if (requiredColors.length !== correctColorsTypes.length) {
    return res.status(400).send({
      message: "Incorrect or missing color, required type Number for keys: 'blue', 'red', 'green' & 'yellow'.",
      success: false
    });
  }

  if (typeof attendee["name"] !== "string" && typeof attendee["phoneNumber"] !== "number") {
    return res.status(400).send({
      message: "Incorrect or missing attendee keys 'name' or 'phoneNumber'.",
      success: false
    });
  }

  return lotteryRepository
    .addAttendee(attendee)
    .then(savedAttendee => {
      var io = req.app.get("socketio");
      io.emit("new_attendee", {});
      return true;
    })
    .then(success =>
      res.send({
        message: `Successfully added attendee ${attendee.name} to lottery.`,
        success: success
      })
    );
};

const updateAttendeeById = (req, res) => {
  const { id } = req.params;
  const { attendee } = req.body;

  return lotteryRepository
    .updateAttendeeById(id, attendee)
    .then(updatedAttendee => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
      return updatedAttendee;
    })
    .then(attendee =>
      res.send({
        attendee,
        message: `Updated attendee: ${attendee.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleteing attendee by id.",
        success: false
      });
    });
};

const deleteAttendeeById = (req, res) => {
  const { id } = req.params;

  return lotteryRepository
    .deleteAttendeeById(id)
    .then(removedAttendee => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
      return removedAttendee;
    })
    .then(attendee =>
      res.send({
        message: `Removed attendee: ${attendee.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleteing attendee by id.",
        success: false
      });
    });
};

const deleteAttendees = (req, res) => {
  return lotteryRepository
    .deleteAttendees()
    .then(removedAttendee => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
    })
    .then(_ =>
      res.send({
        message: "Removed all attendees",
        success: true
      })
    );
};

module.exports = {
  allAttendees,
  addAttendee,
  updateAttendeeById,
  deleteAttendeeById,
  deleteAttendees
};
