const path = require("path");
const { addMessage } = require(path.join(__dirname + "/redis.js"));

const io = (io) => {
  io.on("connection", socket => {
    let localData = null;
    console.log("does this happend second")

    socket.on("message", msg => {
      msg.localData = localData;
      msg.timestamp = new Date().getTime();
      io.emit("message", msg);
    });
  });
};

module.exports = io;
