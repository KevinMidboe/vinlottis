const { promisify } = require("util"); // from node

let client;
let llenAsync;
let lrangeAsync;
try {
  const redis = require("redis");
  console.log("Trying to connect with redis..");
  client = redis.createClient({
    host: '127.0.0.1',
    no_ready_check: true,
    auth_pass: 'sOmE_sEcUrE_pAsS'
  });

  client.zcount = promisify(client.zcount).bind(client);
  client.zadd = promisify(client.zadd).bind(client);
  client.zrevrange = promisify(client.zrevrange).bind(client);
  client.del = promisify(client.del).bind(client);

  client.on("connect", console.log("Redis connection established!"));

  client.on("error", function(err) {
    client.quit();
    console.error("Unable to connect to redis, setting up redis-mock.");

    client = {
      zcount: function() {
        console.log("redis-dummy zcount", arguments);
        return Promise.resolve()
      },
      zadd: function() {
        console.log("redis-dummy zadd", arguments);
        return Promise.resolve();
      },
      zrevrange: function() {
        console.log("redis-dummy zrevrange", arguments);
        return Promise.resolve(null);
      },
      del: function() {
        console.log("redis-dummy del", arguments);
        return Promise.resolve();
      }
    };
  });
} catch (e) {}

const addMessage = message => {
  const json = JSON.stringify(message);
  return client.zadd("messages", message.timestamp, json)
    .then(position => {
      return {
        success: true
      }
    })
};

const history = (page=1, limit=10) => {
  const start = (page - 1) * limit;
  const stop = (limit * page) - 1;

  const getTotalCount = client.zcount("messages", '-inf', '+inf');
  const getMessages = client.zrevrange("messages", start, stop);

  return Promise.all([getTotalCount, getMessages])
    .then(([totalCount, messages]) => {
      if (messages) {
        return {
          messages: messages.map(entry => JSON.parse(entry)).reverse(),
          count: messages.length,
          total: totalCount
        }
      } else {
        return {
          messages: [],
          count: 0,
          total: 0
        }
      }
    })
};

const clearHistory = () => {
  return client.del("messages")
    .then(success => {
      return {
        success: success == 1 ? true : false
      }
    })
};

module.exports = {
  addMessage,
  history,
  clearHistory
};
