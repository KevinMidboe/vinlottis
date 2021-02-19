const path = require("path");

const Attendee = require(path.join(__dirname, "/schemas/Attendee"));
const { UserNotFound } = require(path.join(__dirname, "/vinlottisErrors"));

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

const allAttendees = (isAdmin = false) => {
  if (!isAdmin) {
    return Attendee.find().then(attendees => attendees.map(redactAttendeeInfoMapper));
  } else {
    return Attendee.find();
  }
};

const addAttendee = attendee => {
  const { name, red, blue, green, yellow, phoneNumber } = attendee;

  let newAttendee = new Attendee({
    name,
    red,
    blue,
    green,
    yellow,
    phoneNumber,
    winner: false
  });

  return newAttendee.save().then(_ => newAttendee);
};

const updateAttendeeById = (id, updateModel) => {
  return Attendee.findOne({ _id: id }).then(attendee => {
    if (attendee == null) {
      throw new UserNotFound();
    }

    const updatedAttendee = {
      name: updateModel.name != null ? updateModel.name : attendee.name,
      green: updateModel.green != null ? updateModel.green : attendee.green,
      red: updateModel.red != null ? updateModel.red : attendee.red,
      blue: updateModel.blue != null ? updateModel.blue : attendee.blue,
      yellow: updateModel.yellow != null ? updateModel.yellow : attendee.yellow,
      phoneNumber: updateModel.phoneNumber != null ? updateModel.phoneNumber : attendee.phoneNumber,
      winner: updateModel.winner != null ? updateModel.winner : attendee.winner
    };

    return Attendee.updateOne({ _id: id }, updatedAttendee).then(_ => updatedAttendee);
  });
};

const deleteAttendeeById = id => {
  return Attendee.findOne({ _id: id }).then(attendee => {
    if (attendee == null) {
      throw new UserNotFound();
    }

    return Attendee.deleteOne({ _id: id }).then(_ => attendee);
  });
};

const deleteAttendees = () => {
  return Attendee.deleteMany();
};

module.exports = {
  allAttendees,
  addAttendee,
  updateAttendeeById,
  deleteAttendeeById,
  deleteAttendees
};
