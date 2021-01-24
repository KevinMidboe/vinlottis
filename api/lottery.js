const path = require("path");
const Attendee = require(path.join(__dirname, "/schemas/Attendee"));

const redactAttendeeInfoMapper = attendee => {
  return {
    name: attendee.name,
    raffles: attendee.red + attendee.blue + attendee.yellow + attendee.green,
    red: attendee.red,
    blue: attendee.blue,
    green: attendee.green,
    yellow: attendee.yellow
  };
};

const allAttendees = isAdmin => {
  if (!isAdmin) {
    return Attendee.find().then(attendees => attendees.map(redactAttendeeInfoMapper));
  } else {
    return Attendee.find();
  }
};

const deleteAttendees = () => {
  const io = req.app.get("socketio");

  return Attendee.deleteMany().then(_ => {
    io.emit("refresh_data", {});
    return true;
  });
};

module.exports = {
  allAttendees,
  deleteAttendees
};
