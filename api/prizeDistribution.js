const path = require("path");

const Wine = require(path.join(__dirname, "/schemas/Wine"));
const PreLotteryWine = require(path.join(__dirname, "/schemas/PreLotteryWine"));
const VirtualWinner = require(path.join(__dirname, "/schemas/VirtualWinner"));

const message = require(path.join(__dirname, "/message"));
const highscoreRepository = require(path.join(__dirname, "/winner"));
const wineRepository = require(path.join(__dirname, "/wine"));
const lottery = require(path.join(__dirname, "/lottery"));

const { WinnerNotFound, WineSelectionWinnerNotNextInLine, WinnersTimelimitExpired } = require(path.join(
  __dirname,
  "/vinlottisErrors"
));

const verifyWinnerNextInLine = async id => {
  let foundWinner = await VirtualWinner.findOne({ id: id });

  if (!foundWinner) {
    throw new WinnerNotFound();
  } else if (foundWinner.timestamp_limit < new Date().getTime()) {
    throw new WinnersTimelimitExpired();
  }

  let allWinners = await VirtualWinner.find().sort({ timestamp_drawn: 1 });

  if (
    foundWinner.timestamp_limit == undefined ||
    foundWinner.timestamp_sent == undefined ||
    foundWinner.prize_selected == true
  ) {
    throw new WineSelectionWinnerNotNextInLine();
  }

  return Promise.resolve(foundWinner);
};

const claimPrize = (winner, wine) => {
  return wineRepository
    .addWine(wine)
    .then(_ => lottery.deleteWineById(wine.id)) // prelotteryWine.deleteById
    .then(_ => highscoreRepository.addWinnerWithWine(winner, wine)) // wines.js : addWine
    .then(_ => lottery.addWinnerWithWine(winner, wine))
    .then(_ => message.sendWineConfirmation(winner, wine));
};

const notifyNextWinner = async () => {
  let nextWinner = undefined;

  const winnersLeft = await VirtualWinner.find({ prize_selected: false }).sort({ timestamp_drawn: 1 });
  const winesLeft = await PreLotteryWine.find({ winner: { $exists: false } });

  if (winnersLeft.length > 1) {
    console.log("multiple winners left, choose next in line");
    nextWinner = winnersLeft[0]; // multiple winners left, choose next in line
  } else if (winnersLeft.length == 1 && winesLeft.length > 1) {
    console.log("one winner left, but multiple wines");
    nextWinner = winnersLeft[0]; // one winner left, but multiple wines
  } else if (winnersLeft.length == 1 && winesLeft.length == 1) {
    console.log("one winner and one wine left, choose for user");
    nextWinner = winnersLeft[0]; // one winner and one wine left, choose for user
    wine = winesLeft[0];
    return claimPrize(wine, nextWinner);
  }

  if (nextWinner) {
    return message.sendPrizeSelectionLink(nextWinner).then(_ => startTimeout(nextWinner.id));
  } else {
    console.info("All winners notified. Could start cleanup here.");
    return Promise.resolve({
      message: "All winners notified."
    });
  }
};

// these need to be register somewhere to cancel if something
// goes wrong and we want to start prize distribution again
function startTimeout(id) {
  const minute = 60000;
  const minutesForTimeout = 10;

  console.log(`Starting timeout for user ${id}.`);
  console.log(`Timeout duration: ${minutesForTimeout * minute}`);
  setTimeout(async () => {
    let virtualWinner = await VirtualWinner.findOne({ id: id, prize_selected: false });
    if (!virtualWinner) {
      console.log(`Timeout done for user ${id}, but user has already sent data.`);
      return;
    }
    console.log(`Timeout done for user ${id}, sending update to user.`);

    message.sendWineSelectMessageTooLate(virtualWinner);

    virtualWinner.timestamp_drawn = new Date().getTime();
    virtualWinner.timestamp_limit = null;
    virtualWinner.timestamp_sent = null;
    await virtualWinner.save();

    notifyNextWinner();
  }, minutesForTimeout * minute);

  return Promise.resolve();
}

module.exports = {
  verifyWinnerNextInLine,
  claimPrize,
  notifyNextWinner
};
