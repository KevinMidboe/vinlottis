const request = require("request");
const path = require("path");
const config = require(path.join(__dirname + "/../config/defaults/lottery"));

async function sendMessage(winnerObject) {
  winnerObject.timestamp_sent = new Date().getTime();
  winnerObject.timestamp_limit = new Date().getTime() * 600000;
  await winnerObject.save();

  await sendMessageToUser(
    winnerObject.phoneNumber,
    `Gratulerer som heldig vinner av vinlotteriet ${winnerObject.name}! Her er linken for å velge hva slags vin du vil ha, du har 10 minutter på å velge ut noe før du blir lagt bakerst i køen. /#/winner/${winnerObject.id}`
  );

  return true;
}

async function sendWonWineMessage(winnerObject, wineObject) {
  console.log(
    `User ${winnerObject.id} is only one left, chosing wine for him/her.`
  );
  winnerObject.timestamp_sent = new Date().getTime();
  winnerObject.timestamp_limit = new Date().getTime();
  await winnerObject.save();

  await sendMessageToUser(
    winnerObject.phoneNumber,
    `Gratulerer som heldig vinner av vinlotteriet ${winnerObject.name}! Du har vunnet vinen ${wineObject.name}, og vil få nærmere info om hvordan/hvor du kan hente vinen snarest. Ha en ellers fin helg!`
  );

  return true;
}

async function sendMessageTooLate(winnerObject) {
  await sendMessageToUser(
    winnerObject.phoneNumber,
    `Hei ${winnerObject.name}, du har dessverre brukt mer enn 10 minutter på å velge premie og blir derfor puttet bakerst i køen. Du vil få en ny SMS når det er din tur igjen.`
  );
}

async function sendMessageToUser(phoneNumber, message) {
  request.post(
    {
      url: `https://gatewayapi.com/rest/mtsms?token=${config.token}`,
      json: true,
      body: {
        sender: "Vinlottis",
        message: message,
        recipients: [{ msisdn: `47${phoneNumber}` }]
      }
    },
    function(err, r, body) {
      console.log(err ? err : body);
    }
  );
}

async function sendUpdate(winners) {
  let numbers = [];
  for (let i = 0; i < winners.length; i++) {
    numbers.push({ msisdn: `47${winners[i].phoneNumber}` });
  }
  request.post(
    {
      url: `https://gatewayapi.com/rest/mtsms?token=${config.token}`,
      json: true,
      body: {
        sender: "Vinlottis",
        message:
          "Gratulerer som vinner av vinlottisen! Du vil snart få en SMS med oppdatering om hvordan gangen går!",
        recipients: numbers
      }
    },
    function(err, r, body) {
      console.log(err ? err : body);
    }
  );
}

module.exports.sendUpdate = sendUpdate;
module.exports.sendMessage = sendMessage;
module.exports.sendMessageTooLate = sendMessageTooLate;
module.exports.sendWonWineMessage = sendWonWineMessage;
