const https = require("https");
const path = require("path");
const config = require(path.join(__dirname + "/../config/defaults/lottery"));
const logger = require(path.join(`${__base}/logger`));

const { addMessage } = require(`${__base}/controllers/logsController`);

const dateString = date => {
  if (typeof date == "string") {
    date = new Date(date);
  }
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${da}-${mo}-${ye}`;
};

async function sendInitialMessageToWinners(winners) {
  // const numbers = winners.map(winner => ({ msisdn: `47${winner.phoneNumber}` }));
  const numbers = [{msisdn: '4741498549'}]

  const body = {
    sender: "Vinlottis",
    message:
      "Gratulerer som vinner av vinlottisen! Du vil snart få en SMS med oppdatering om hvordan gangen går!",
    recipients: numbers,
  };

  addMessage({
    message: 'Sending bulk winner confirmation message to all winners',
    recipients: body.recipients,
    smsText: body.message,
    sender: body.sender,
    template: 'sendInitialMessageToWinners'
  })

  return gatewayRequest(body);
}

async function sendPrizeSelectionLink(winner) {
  winner.timestamp_sent = new Date().getTime();
  winner.timestamp_limit = new Date().getTime() + 1000 * 600;
  await winner.save();

  const { id, name, phoneNumber } = winner;
  const url = new URL(`/winner/${id}`, `https://${config.domain}`);
  const message = `Gratulerer som heldig vinner av vinlotteriet ${name}! Her er linken for \
å velge hva slags vin du vil ha, du har 10 minutter på å velge ut noe før du blir lagt bakerst \
i køen. ${url.href}. (Hvis den siden kommer opp som tom må du prøve å refreshe siden noen ganger.`;

  return sendMessageToNumber(phoneNumber, message);
}

async function sendWineConfirmation(winnerObject, wineObject, date) {
  date = dateString(date);
  return sendMessageToNumber(
    winnerObject.phoneNumber,
    `Bekreftelse på din vin ${winnerObject.name}.\nDato vunnet: ${date}.\nVin valgt: ${wineObject.name}.\
\nDu vil bli kontaktet av ${config.name} ang henting. Ha en ellers fin helg!`
  );
}

async function sendLastWinnerMessage(winnerObject, wineObject) {
  logger.log(`User ${winnerObject.id} is only one left, chosing wine for him/her.`);
  winnerObject.timestamp_sent = new Date().getTime();
  winnerObject.timestamp_limit = new Date().getTime();
  await winnerObject.save();

  return sendMessageToNumber(
    winnerObject.phoneNumber,
    `Gratulerer som heldig vinner av vinlotteriet ${winnerObject.name}! Du har vunnet vinen ${wineObject.name}, \
du vil bli kontaktet av ${config.name} ang henting. Ha en ellers fin helg!`
  );
}

async function sendWineSelectMessageTooLate(winnerObject) {
  return sendMessageToNumber(
    winnerObject.phoneNumber,
    `Hei ${winnerObject.name}, du har dessverre brukt mer enn 10 minutter på å velge premie og blir derfor \
puttet bakerst i køen. Du vil få en ny SMS når det er din tur igjen.`
  );
}

async function sendMessageToNumber(phoneNumber, message) {
  logger.info(`Attempting to send message`, {
    phoneNumber,
    message
  });

  const body = {
    sender: "Vinlottis",
    message: message,
    recipients: [{ msisdn: `47${phoneNumber}` }],
  };


  addMessage({
    recipients: body.recipients,
    smsText: body.message,
    sender: body.sender,
    message: `Sending message`,
    template: 'sendMessageToNumber'
  })
  return gatewayRequest(body);
}

async function gatewayRequest(body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "gatewayapi.com",
      post: 443,
      path: `/rest/mtsms?token=${config.gatewayToken}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    // body.recipients = [{msisdn: `123123123123123123123123128937123987192837`}]

    const req = https.request(options, res => {
      const { statusCode, statusMessage } = res;
      logger.info(`Response from gatewayapi.`, {
        statusMessage,
        statusCode
      });

      addMessage({
        message: `Gateway api response`,
        statusMessage,
        statusCode,
        type: res.statusCode == 200 ? 'message' : 'error'
      });

      res.setEncoding("utf8");

      if (res.statusCode == 200) {
        res.on("data", data => {
          logger.info("Response from message gateway", { data });
          data = JSON.parse(data);
          addMessage({ ...data, message: `Response from message gateway` });

          resolve(data);
        });
      } else {
        res.on("data", data => {
          console.log('error data:', data)
          data = JSON.parse(data);
          if (data['message'] != null) {
            data['errorMessage'] = data.message
            delete data.message
          }
          message = `SMS request returned error from provider!`

          addMessage({ ...data, message, type: 'error' });
          // addMessage(`Gateway error: ${data["message"] || JSON.stringify(JSON.parse(data))}\n\n`);
          return reject("Gateway error: " + data["message"] || data);
        });
      }
    });

    req.on("error", error => {
      logger.error("Error from sms service.",{error});
      addMessage({ ...error, message: `Error from sms service`, type: 'error' });
      reject(`Error from sms service: ${error}`);
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

module.exports = {
  sendInitialMessageToWinners,
  sendPrizeSelectionLink,
  sendWineConfirmation,
  sendLastWinnerMessage,
  sendWineSelectMessageTooLate,
};
