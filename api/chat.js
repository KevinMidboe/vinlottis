const path = require("path");
const { addMessage } = require(path.join(__dirname + "/redis.js"));

const validateUsername = (username) => {
  let error = undefined;
  const illegalChars = /\W/;
  const minLength = 3;
  const maxLength = 15;

  if (typeof username !== 'string') {
    error = 'Ugyldig brukernavn.';
  } else if (username.length === 0) {
    error = 'Vennligst oppgi brukernavn.';
  } else if (username.length < minLength || username.length > maxLength) {
    error = `Brukernavn må være mellom ${minLength}-${maxLength} karaktere.`
  } else if (illegalChars.test(username)) {
    error = 'Brukernavn kan bare inneholde tall og bokstaver.'
  }

  return error;
}

const io = (io) => {
  io.on("connection", socket => {
    console.log("does this happend first")
    let username = null;

    socket.on("username", msg => {
      const usernameValidationError = validateUsername(msg.username);
      if (usernameValidationError) {
        username = null;
        socket.emit("accept_username", {
          reason: usernameValidationError,
          success: false,
          username: undefined
        });
      } else {
        username = msg.username;
        socket.emit("accept_username", {
          reason: undefined,
          success: true,
          username: msg.username
        });
      }
    });

    socket.on("chat", msg => {
      msg.username = username;
      msg.timestamp = new Date().getTime();
      addMessage(msg);
      io.emit("chat", msg);
    });
  });
};

module.exports = io;
