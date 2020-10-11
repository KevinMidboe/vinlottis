const path = require("path");

const _wineFunctions = require(path.join(__dirname + "/../api/wine"));
const _personFunctions = require(path.join(__dirname + "/../api/person"));
const Message = require(path.join(__dirname + "/../api/message"));
const VirtualWinner = require(path.join(
  __dirname + "/../schemas/VirtualWinner"
));
const PreLotteryWine = require(path.join(
  __dirname + "/../schemas/PreLotteryWine"
));


const getWinesToWinnerById = async (req, res) => {
  let id = req.params.id;
  let foundWinner = await VirtualWinner.findOne({ id: id });

  if (!foundWinner) {
    return res.json({
      success: false,
      message: "No winner with this id.",
      existing: false,
      turn: false
    });
  }

  let allWinners = await VirtualWinner.find().sort({ timestamp_drawn: 1 });
  if (
    allWinners[0].id != foundWinner.id ||
    foundWinner.timestamp_limit == undefined ||
    foundWinner.timestamp_sent == undefined
  ) {
    return res.json({
      success: false,
      message: "Not the winner next in line!",
      existing: true,
      turn: false
    });
  }

  return res.json({
    success: true,
    existing: true,
    turn: true,
    name: foundWinner.name,
    color: foundWinner.color
  });
};

const registerWinnerSelection = async (req, res) => {
  let id = req.params.id;
  let wineName = req.body.wineName;
  let foundWinner = await VirtualWinner.findOne({ id: id });

  if (!foundWinner) {
    return res.json({
      success: false,
      message: "No winner with this id."
    })
  } else if (foundWinner.timestamp_limit < new Date().getTime()) {
    return res.json({
      success: false,
      message: "Timelimit expired, you will receive a wine after other users have chosen.",
      limit: true
    })
  }

  let date = new Date();
  date.setHours(5, 0, 0, 0);
  let prelotteryWine = await PreLotteryWine.findOne({ name: wineName });

  if (!prelotteryWine) {
    return res.json({
      success: false,
      message: "No wine with this name.",
      wine: false
    });
  }

  let wonWine = await _wineFunctions.findSaveWine(prelotteryWine);
  await prelotteryWine.delete();
  await _personFunctions.findSavePerson(foundWinner, wonWine, date);

  await foundWinner.delete();
  console.info("Saved winners choice.");

  return findAndNotifyNextWinner()
    .then(() => res.json({
      message: "Choice saved and next in line notified.",
      success: true
    }))
    .catch(error => res.json({
      message: error["message"] || "Error when notifing next winner.",
      success: false
    }))
};

const chooseLastWineForUser = (winner, preLotteryWine) => {
  let date = new Date();
  date.setHours(5, 0, 0, 0);

  return _wineFunctions.findSaveWine(preLotteryWine)
    .then(wonWine => _personFunctions.findSavePerson(winner, wonWine, date))
    .then(() => preLotteryWine.delete())
    .then(() => Message.sendLastWinnerMessage(winner, preLotteryWine))
    .then(() => winner.delete())
    .catch(err => {
      console.log("Error thrown from chooseLastWineForUser: " + err);
      throw err;
    })
}

const findAndNotifyNextWinner = async () => {
  let nextWinner = undefined;

  let winnersLeft = await VirtualWinner.find().sort({ timestamp_drawn: 1 });
  let winesLeft = await PreLotteryWine.find();

  if (winnersLeft.length > 1) {
    nextWinner = winnersLeft[0]; // multiple winners left, choose next in line
  } else if (winnersLeft.length == 1 && winesLeft.length > 1) {
    nextWinner = winnersLeft[0] // one winner left, but multiple wines
  } else if (winnersLeft.length == 1 && winesLeft.length == 1) {
    nextWinner = winnersLeft[0] // one winner and one wine left, choose for user
    wine = winesLeft[0]
    return chooseLastWineForUser(nextWinner, wine);
  }

  if (nextWinner) {
    return Message.sendWineSelectMessage(nextWinner)
      .then(messageResponse => startTimeout(nextWinner.id))
  } else {
    console.info("All winners notified. Could start cleanup here.");
    return Promise.resolve({
      message: "All winners notified."
    })
  }
};

const sendNotificationToWinnerById = async (req, res) => {
  const { id } = req.params;
  let winner = await VirtualWinner.findOne({ id: id });

  if (!winner) {
    return res.json({
      message: "No winner with this id.",
      success: false
    })
  }

  return Message.sendWineSelectMessage(winner)
    .then(success => res.json({
      success: success,
      message: `Message sent to winner ${id} successfully!`
    }))
    .catch(err => res.json({
      success: false,
      message: "Error while trying to send sms.",
      error: err
    }))
}

function startTimeout(id) {
  const minute = 60000;
  const minutesForTimeout = 10;

  console.log(`Starting timeout for user ${id}.`);
  console.log(`Timeout duration: ${ minutesForTimeout * minute }`)
  setTimeout(async () => {
    let virtualWinner = await VirtualWinner.findOne({ id: id });
    if (!virtualWinner) {
      console.log(`Timeout done for user ${id}, but user has already sent data.`);
      return;
    }
    console.log(`Timeout done for user ${id}, sending update to user.`);

    Message.sendWineSelectMessageTooLate(virtualWinner);

    virtualWinner.timestamp_drawn = new Date().getTime();
    virtualWinner.timestamp_limit = null;
    virtualWinner.timestamp_sent = null;
    await virtualWinner.save();

    findAndNotifyNextWinner();
  }, minutesForTimeout * minute);

  return Promise.resolve()
}

module.exports = {
  getWinesToWinnerById,
  registerWinnerSelection,
  findAndNotifyNextWinner,

  sendNotificationToWinnerById
};
