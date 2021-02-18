const path = require("path");

const VirtualWinner = require(path.join(__dirname, "/schemas/VirtualWinner"));
const { WinnerNotFound } = require(path.join(__dirname, "/vinlottisErrors"));

const addWinners = winners => {
  return Promise.all(
    winners.map(winner => {
      let newWinnerElement = new VirtualWinner({
        name: winner.name,
        color: winner.color,
        timestamp_drawn: new Date().getTime()
      });

      return newWinnerElement.save();
    })
  );
};

const allWinners = (isAdmin = false) => {
  const sortQuery = { timestamp_drawn: 1 };

  if (!isAdmin) {
    return VirtualWinner.find()
      .sort(sortQuery)
      .then(winners => winners.map(redactWinnerInfoMapper));
  } else {
    return VirtualWinner.find().sort(sortQuery);
  }
};

const winnerById = (id, isAdmin = false) => {
  return VirtualWinner.findOne({ _id: id }).then(winner => {
    if (winner == null) {
      throw new WinnerNotFound();
    }

    if (!isAdmin) {
      return redactWinnerInfoMapper(winner);
    } else {
      return winner;
    }
  });
};

const updateWinnerById = (id, updateModel) => {
  return VirtualWinner.findOne({ id: id }).then(winner => {
    if (winner == null) {
      throw new WinnerNotFound();
    }

    const updatedWinner = {
      name: updateModel.name != null ? updateModel.name : winner.name,
      phoneNumber: updateModel.phoneNumber != null ? updateModel.phoneNumber : winner.phoneNumber,
      red: updateModel.red != null ? updateModel.red : winner.red,
      green: updateModel.green != null ? updateModel.green : winner.green,
      blue: updateModel.blue != null ? updateModel.blue : winner.blue,
      yellow: updateModel.yellow != null ? updateModel.yellow : winner.yellow,
      timestamp_drawn: updateModel.timestamp_drawn != null ? updateModel.timestamp_drawn : winner.timestamp_drawn,
      timestamp_limit: updateModel.timestamp_limit != null ? updateModel.timestamp_limit : winner.timestamp_limit,
      timestamp_sent: updateModel.timestamp_sent != null ? updateModel.timestamp_sent : winner.timestamp_sent
    };

    return VirtualWinner.updateOne({ id: id }, updatedWinner).then(_ => updatedWinner);
  });
};

const deleteWinnerById = id => {
  return VirtualWinner.findOne({ _id: id }).then(winner => {
    if (winner == null) {
      throw new WinnerNotFound();
    }

    return VirtualWinner.deleteOne({ _id: id }).then(_ => winner);
  });
};

const deleteWinners = () => {
  return VirtualWinner.deleteMany();
};

module.exports = {
  addWinners,
  allWinners,
  winnerById,
  updateWinnerById,
  deleteWinnerById,
  deleteWinners
};
