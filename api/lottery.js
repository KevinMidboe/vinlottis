const path = require("path");
const Attendee = require(path.join(__dirname, "/schemas/Attendee"));
const PreLotteryWine = require(path.join(__dirname, "/schemas/PreLotteryWine"));

class UserNotFound extends Error {
  constructor(message = "User not found.") {
    super(message);
    this.name = "UserNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WineNotFound extends Error {
  constructor(message = "Wine not found.") {
    super(message);
    this.name = "WineNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

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

  return newAttendee.save();
};

const updateAttendeeById = (id, updateModel) => {
  return Attendee.findOne({ _id: id }).then(attendee => {
    if (attendee == null) {
      throw new UserNotFound();
    }

    const updatedAttendee = {
      name: updateModel.name || attendee.name,
      green: updateModel.green || attendee.green,
      red: updateModel.red || attendee.red,
      blue: updateModel.blue || attendee.blue,
      yellow: updateModel.yellow || attendee.yellow,
      phoneNumber: updateModel.phoneNumber || attendee.phoneNumber
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

const allWines = () => {
  return PreLotteryWine.find();
};

const addWines = wines => {
  const prelotteryWines = wines.map(wine => {
    let newPrelotteryWine = new PreLotteryWine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: wine.rating,
      image: wine.image,
      price: wine.price,
      country: wine.country,
      id: wine.id
    });

    return newPrelotteryWine.save();
  });

  return Promise.all(prelotteryWines);
};

const updateWineById = (id, updateModel) => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    const updatedWine = {
      name: updateModel.name || wine.name,
      vivinoLink: updateModel.vivinoLink || wine.vivinoLink,
      rating: updateModel.rating || wine.rating,
      image: updateModel.image || wine.image,
      price: updateModel.price || wine.price,
      country: updateModel.country || wine.country,
      id: updateModel.id || wine.id
    };

    return PreLotteryWine.updateOne({ _id: id }, updatedWine).then(_ => updatedWine);
  });
};

const deleteWineById = id => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    return PreLotteryWine.deleteOne({ _id: id }).then(_ => wine);
  });
};

const deleteWines = () => {
  return PreLotteryWine.deleteMany();
};

module.exports = {
  allAttendees,
  addAttendee,
  updateAttendeeById,
  deleteAttendeeById,
  deleteAttendees,
  allWines,
  addWines,
  updateWineById,
  deleteWineById,
  deleteWines
};
