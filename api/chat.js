const path = require("path");
const { addMessage } = require(path.join(__dirname + "/redis.js"));

const io = (io) => {
  io.on("connection", socket => {
    let username = null;

    socket.on("username", msg => {
      if (msg.username == null) {
        username = null;
        socket.emit("accept_username", false);
        return;
      }
      if (msg.username.length > 3 && msg.username.length < 30) {
        username = msg.username;
        socket.emit("accept_username", true);
        return;
      }
      socket.emit("accept_username", false);
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
