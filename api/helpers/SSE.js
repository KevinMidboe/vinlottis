class SSE {
  constructor(response, clientId, base64encode=false) {
    if (!(this instanceof SSE)) {
      return new SSE(response, clientId, base64encode);
    }
    this.response = response;
    this.clientId = clientId;
    this.base64encodeData = base64encode;
    this.delay = 1000;
    this.lastMessageId;

    this.manualShutdown;

    this.setupEventStream();
    this.welcomeClient();
  }

  welcomeClient() {
    console.log("welcome client")
    this.response.write('id\n\n'); // reset the id counter
  }

  setupEventStream() {
    this.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  }

  setupMessageData(message) {
    if (typeof message === 'string') {
      message = { message: message }
    }

    message.type = message.type != null ? message.type : 'message';

    message = JSON.stringify(message, null, 1);
    if (this.base64encodeData === true) {
      message = btoa(message);
    }

    return message;
  }

  writeMessage(message, id=null) {
    console.log(`Sending message to client: ${this.clientId}, id: ${id} ${this.id}`);

    message = this.setupMessageData(message);
    this.id = id || this.id

    this.response.write(`id: ${id}\n`);
    this.response.write(`retry: 10000\n`)
    this.response.write(`data: ${message}\n\n`)
  }

  writeClose() {
    const message = {
      message: 'Server asking client to close connection',
      type: 'end'
    }

    const data = this.setupMessageData(message);
    this.response.write(`data: ${data}\n\n`);
  }

  end() {
    console.log("END CALLED, asking client to close")
    this.writeClose();

    // give it a safe buffer of time before we shut it down manually
    const res = this.response;
    this.manualShutdown = setTimeout(() => {
      console.log("forcing server side")
      res.end()
    }, 2000)
    this.response.end();
  }
}


module.exports = SSE;