const https = require("https");
const path = require("path");
const config = require(path.join(__dirname + "/../config/defaults/lottery"));

async function sendWineSelectMessage(winnerObject) {
  winnerObject.timestamp_sent = new Date().getTime();
  winnerObject.timestamp_limit = new Date().getTime() * 600000;
  await winnerObject.save();

  let url = new URL(`/#/winner/${winnerObject.id}`, "https://lottis.vin");

  return sendMessageToUser(
    winnerObject.phoneNumber,
    `Gratulerer som heldig vinner av vinlotteriet ${winnerObject.name}! Her er linken for å velge hva slags vin du vil ha, du har 10 minutter på å velge ut noe før du blir lagt bakerst i køen. ${url.href}. (Hvis den siden kommer opp som tom må du prøve å refreshe siden noen ganger.)`
  )
}

async function sendLastWinnerMessage(winnerObject, wineObject) {
  console.log(`User ${winnerObject.id} is only one left, chosing wine for him/her.`);
  winnerObject.timestamp_sent = new Date().getTime();
  winnerObject.timestamp_limit = new Date().getTime();
  await winnerObject.save();

  return sendMessageToUser(
    winnerObject.phoneNumber,
    `Gratulerer som heldig vinner av vinlotteriet ${winnerObject.name}! Du har vunnet vinen ${wineObject.name}, og vil få nærmere info om hvordan/hvor du kan hente vinen snarest. Ha en ellers fin helg!`
  );
}

async function sendWineSelectMessageTooLate(winnerObject) {
  return sendMessageToUser(
    winnerObject.phoneNumber,
    `Hei ${winnerObject.name}, du har dessverre brukt mer enn 10 minutter på å velge premie og blir derfor puttet bakerst i køen. Du vil få en ny SMS når det er din tur igjen.`
  );
}

async function sendMessageToUser(phoneNumber, message) {
  console.log(`Attempting to send message to ${ phoneNumber }.`)

  const body = {
    sender: "Vinlottis",
    message: message,
    recipients: [{ msisdn: `47${ phoneNumber }`}]
  };

  return gatewayRequest(body);
}


async function sendInitialMessageToWinners(winners) {
  let numbers = [];
  for (let i = 0; i < winners.length; i++) {
    numbers.push({ msisdn: `47${winners[i].phoneNumber}` });
  }

  const body = {
    sender: "Vinlottis",
    message:
      "Gratulerer som vinner av vinlottisen! Du vil snart få en SMS med oppdatering om hvordan gangen går!",
    recipients: numbers
  }

  return gatewayRequest(body);
}

async function gatewayRequest(body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "gatewayapi.com",
      post: 443,
      path: `/rest/mtsms?token=${ config.gatewayToken }`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${ res.statusCode }`);
      console.log(`statusMessage: ${ res.statusMessage }`);

      res.setEncoding('utf8');

      if (res.statusCode == 200) {
        res.on("data", (d) => resolve(JSON.parse(d)));
      } else {
        res.on("data", (data) => {
          data = JSON.parse(data);
          return reject('Gateway error: ' + data['message'] || data)
        });
      }
    })

    req.on("error", (error) => {
      console.error(`Error from sms service: ${ error }`);
      reject(`Error from sms service: ${ error }`);
    })

    req.write(JSON.stringify(body));
    req.end();
  });
}

module.exports = {
  sendWineSelectMessage,
  sendLastWinnerMessage,
  sendWineSelectMessageTooLate,
  sendInitialMessageToWinners
}
