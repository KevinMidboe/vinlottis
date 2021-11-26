<template>
  <div class="page-container">
    <h1>Prisutdeling</h1>

    <div class="prize-distribution">
      <h2>Prisutdeling</h2>

      <div class="button-container">
        <button class="vin-button" @click="startPrizeDistribution">
          Start automatisk prisutdeling med SMS
        </button>
      </div>
    </div>

    <div class="sms-service-output">
      <h2>Logger</h2>

      <div class="connection-status">
        <p>{{ logConnectionStatus }}</p>
      </div>

      <button @click="closeConnection">Close connection</button>
      <button @click="connectToEventStream">Open connection</button>

      <div class="terminal">
        <ul v-if="logs.length">
          <li v-for="(log, index) in reversedLogs" :class="{selected: selectedIndexs.find(el => el === index) !== undefined}">
            <!-- <span class="line">{{ secondsAgo(log) }}</span> -->
            <span class="line">{{ logLength - index }}</span>
            <LogMessage :log="log" @toggleMessage="(value) => setSelectedIndex(index, value)" />
          </li>
        </ul> 
        <p v-else>No logs yet...</p>
      </div>
    </div>
  </div>
</template>

<script>
import LogMessage from "@/components/admin/logMessage";

export default {
  components: { LogMessage },
  computed: {
    reversedLogs() {
      return [...this.logs].reverse()
    },
    logLength() {
      return this.logs.length;
    },
  },
  data() {
    return {
      source: null,
      logConnectionStatus: 'Disconnected',
      logs: [],
      selectedIndexs: []
    }
  },
  created() {
    this.connectToEventStream();
    window.addEventListener('beforeunload', this.closeConnection);
  },
  beforeDestroy() {
    this.closeConnection();
  },
  methods: {
    setSelectedIndex(index, value) {
      if (value === true) {
        this.selectedIndexs.push(index);
      } else {
        this.selectedIndexs = this.selectedIndexs.filter(el => el !== index);
      }
    },
    closeConnection() {
      console.log("close event received");
      this.logConnectionStatus = 'closed';
      this.source.close();
    },
    secondsAgo(log) {
      const seconds = Math.floor((new Date() - new Date(log.timestamp)) / 1000)
      return `${seconds} s`
    },
    connectToEventStream() {
      let SOURCE_URL = '/api/logs/sms?contentTransferEncoding=base64'
      if (this.lastMessageId) {
        SOURCE_URL = `${SOURCE_URL}&lastMessageId=${this.lastMessageId}`
      }
      this.source = new EventSource(SOURCE_URL);

      if (this.logs.length) {
        this.logs.push({
          message: '- - - new session - - -',
          timestamp: new Date(),
          type: 'INFO'
        })
      }

      this.source.onmessage = (event) => this.handleMessage(event);
      this.source.onopen = (event) => this.handleConnectionOpened(event);
      this.source.onerror = (event) => this.handleError(error);
    },
    handleConnectionOpened(event) {
      this.logConnectionStatus = 'Connected';
    },
    handleMessage(event) {
      this.lastMessageId = event.lastEventId;
      let message = JSON.parse(atob(event.data));
      if (message.type === 'close') {
        this.closeConnection();
      }

      this.logs.push(message);
    },
    handleError(event) {
      if (event.eventPhase == EventSource.CLOSED) {
        console.log("Server closed connection, clean up client side");
        this.source.close();
      }

      if (event.target.readyState == EventSource.CLOSED) 
        this.logConnectionStatus = "Disconnected"
      else if (event.target.readyState == EventSource.CONNECTING)
        this.logConnectionStatus = "Connecting..."
      else
        console.warning('Unknown SSE event state');
    },
    startPrizeDistribution() {
      if (!window.confirm("Er du sikker på at du vil starte prisutdeling?")) {
        return;
      }

      const options = { method: "POST" };
      fetch(`/api/lottery/prize-distribution/start`, options)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.$toast.info({
              title: `Startet prisutdeling. SMS'er sendt ut!`,
            });
          } else {
            this.$toast.error({
              title: `Klarte ikke starte prisutdeling`,
              description: response.message,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.terminal {
  padding: 1.5rem 1rem 1rem;
  background-color: #333333;
  color: white;
  font-family: "Roboto Mono", Monaco, "Courier New", monospace;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  white-space: pre;
  max-width: 90vw;
  overflow-x: auto;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    text-decoration: none;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    width: fit-content;
    transition: all 0.3s ease;

    &.selected {
      background-color: lightgrey;
      color: black;
    }
  }

  .line {
    padding-right: 0.5rem;
    border-right: 2px solid grey;
    min-width: 1.5rem;
    text-align: right;
  }

  p {
    margin: 0;
    padding: 0;
  }
}
</style>
