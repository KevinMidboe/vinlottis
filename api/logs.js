var url = require("url");
const path = require("path");
const SSE = require(`${__base}/helpers/SSE.js`);
// const logsRepository = require(path.join(__dirname, "../logs"));

let messages = [];
let connections = [];
let history = [];
let lastMessageId = 0;

// class SSEHandler {
//   constructor(req, res) {
//     this.req = req;
//     this.res = res;

//     this.base64Encode = this.clientRequestedBase64Encoding();
//     this.setupClient()
//   }

//   setupClient() {
//     this.
//   }

//   get clientRequestedBase64Encoding() {
//     return this.req.query.contentTransferEncoding === 'base64' || false;
//   }
// }

function subscribeToLogs(req, res){
  const base64encode = req.query?.contentTransferEncoding == 'base64' || false;
  const clientId = Date.now();

  const sseClient = new SSE(res, clientId, base64encode)
  connections.push(sseClient);

  req.on('close', () => clientClosed(clientId));
  req.on('error', console.log);
  sendMissingMessageToClient(sseClient, req);
};

function sendMissingMessageToClient(seeClient, req) {
  var urlParts = url.parse(req.url, true);
  let localHistory = [...history];

  if (req.headers['last-event-id']) {
    const index = parseInt(req.headers['last-event-id']);
    console.log("last-event-id FOUND from header!", index)

    localHistory = localHistory.slice(index);
  } else if (urlParts.query["lastMessageId"]) {
    const index = urlParts.query["lastMessageId"];
    console.log("last-event-id FOUND from url!", index)

    localHistory = localHistory.slice(index);
  }

  localHistory.forEach(el => seeClient.writeMessage(el.message, el.lastMessageId))
}

function removeConnection(clientConnection) {
  const connectionIndex = connections.indexOf(clientConnection);
  if (connectionIndex !== -1) {
    connections.splice(connectionIndex, 1);
  }
}

const clientClosed = (clientId) => {
  console.log(`${clientId} close event received`);
  const client = connections.find(client => client.clientId == clientId);
  clearTimeout(client.manualShutdown)
  removeConnection(client);
  console.log(`Client success removed: ${connections}`);
}

const state = (req, res) => {
  return res.json({
    connections: connections.length
  })
}

function broadcast(historyMessage, id) {
  console.log(`sending to all ${connections.length} of our connections.`);

  connections.forEach(client => {
    try {
      client.writeMessage(historyMessage, id);
    } catch (error) {
      console.log(`got error while sending message to client: ${client.clientId}`, error);
    }
  });
}

// const addMessageFromApi = (req, res) => {
//   const { message } = req.params;
//       addMessage(message)
//     return res.json({
//       success: true,
//       connections: connections.length,
//       message: JSON.stringify(message)
//     })
//   // try {

//   // } catch (error) {
//   //   console.error
//   //   return res.json({
//   //     success: false,
//   //     connections: connections.length,
//   //     message: JSON.stringify(message),
//   //     error
//   //   })
//   // }

// }

const kickClient = (req, res) => {
  const { id } = req.params;

  // console.log("connections:", connections )
  const client = connections.find(client => client.clientId == id);
  if (client) {
    client.end();
    return res.json({
      success: true,
      connections: connections.length,
      message: 'Client success removed'
    })
  } else {
    return res.status(404).json({
      success: false,
      message: "Client not found"
    })
  }

}

const addMessage = (message) => {
  console.log(`adding messagE: ${message}`);

  ++lastMessageId;
  const timestamp = new Date();

  let historyMessage;
  if (typeof message === 'string') {
    historyMessage = {
      message,
      timestamp
    }
  } else {
    historyMessage = {
      ...message,
      timestamp
    }
  }

  history.push({message: historyMessage, lastMessageId});

  if (connections.length > 0) {
    broadcast(historyMessage, lastMessageId);
  } else {
    console.log("Message added to history, but no clients to send to")
  }
}

module.exports = {
  subscribeToLogs,
  state,
  addMessage,
  kickClient,
  addMessageFromApi
};
