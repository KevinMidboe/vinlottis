const redis = require("redis")
const client = redis.createClient()


const addMessage = message => {
  const json = JSON.stringify(message);
  client.rpush("messages", json)

  return message
}

const history = (skip=0, take=20) => {
  skip = (1 + skip) * -1     // negate to get FIFO
  return new Promise((resolve, reject) => client.lrange("messages", (skip * take), skip, (err, data) => {
    if (err) {
      console.log(err);
      reject(err);
    }

    data = data.map(data => JSON.parse(data));
    resolve(data);
  }))
}

const clearHistory = () => {
  return new Promise((resolve, reject) => client.del("messages", (err, success) => {
    if (err) {
      console.log(err);
      reject(err);
    }
    resolve(success == 1 ? true : false);
  }))
}

module.exports = {
  addMessage,
  history,
  clearHistory
};