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
  deleteWinnerById,
  deleteWinners
};
