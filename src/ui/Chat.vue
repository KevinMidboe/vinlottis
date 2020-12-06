<template>
  <div class="chat-container">
    <hr />
    <h2>Chat</h2>
    <div class="history" ref="history" v-if="chatHistory.length > 0">
      <div class="opaque-skirt"></div>
      <div v-if="hasMorePages" class="fetch-older-history">
        <button @click="loadMoreHistory">Hent eldre meldinger</button>
      </div>

      <div class="history-message"
        v-for="(history, index) in chatHistory"
        :key="`${history.username}-${history.timestamp}-${index}`"
      >
        <div>
          <span class="username">{{ history.username }}</span>
          <span class="timestamp">{{ getTime(history.timestamp) }}</span>
        </div>
        <span class="message">{{ history.message }}</span>
      </div>
    </div>
    <div v-if="username" class="input">
      <input @keyup.enter="sendMessage" type="text" v-model="message" placeholder="Melding.." />
      <button @click="sendMessage">Send</button>
      <button @click="removeUsername">Logg ut</button>
    </div>
    <div v-else class="username-dialog">
      <input
        type="text"
        @keyup.enter="setUsername"
        v-model="temporaryUsername"
        maxlength="30"
        placeholder="Ditt navn.."
      />

      <div class="validation-error" v-if="validationError">
        {{ validationError }}
      </div>
      <button @click="setUsername">Lagre brukernavn</button>
    </div>
  </div>
</template>

<script>
import { getChatHistory } from "@/api";
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      chatHistory: [],
      hasMorePages: true,
      message: "",
      page: 1,
      pageSize: 10,
      temporaryUsername: null,
      username: null,
      validationError: undefined
    };
  },
  created() {
    getChatHistory(1, this.pageSize)
      .then(resp => {
        this.chatHistory = resp.messages;
        this.hasMorePages = resp.total != resp.messages.length;
      });
    const username = window.localStorage.getItem('username');
    if (username) {
      this.username = username;
      this.emitUsernameOnConnect = true;
    }
  },
  watch: {
    chatHistory: {
      handler: function(newVal, oldVal) {
        if (oldVal.length == 0) {
          this.scrollToBottomOfHistory();
        }
        else if (newVal && newVal.length == oldVal.length) {
          if (this.isScrollPositionAtBottom()) {
            this.scrollToBottomOfHistory();
          }
        } else {
          const prevOldestMessage = oldVal[0];
          this.scrollToMessageElement(prevOldestMessage);
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.socket = null;
  },
  mounted() {
    const BASE_URL = __APIURL__ || window.location.origin;
    this.socket = io(`${BASE_URL}`);
    this.socket.on("chat", msg => {
      this.chatHistory.push(msg);
    });

    this.socket.on("disconnect", msg => {
      this.wasDisconnected = true;
    });

    this.socket.on("connect", msg => {
      if (
        this.emitUsernameOnConnect ||
        (this.wasDisconnected && this.username != null)
      ) {
        this.setUsername(this.username);
      }
    });

    this.socket.on("accept_username", msg => {
      const { reason, success, username } = msg;
      this.usernameAccepted = success;

      if (success !== true) {
        this.username = null;
        this.validationError = reason;
      } else {
        this.usernameAllowed = true;
        this.username = username;
        this.validationError = null;
        window.localStorage.setItem("username", username);
      }
    });
  },
  methods: {
    loadMoreHistory() {
      let { page, pageSize } = this;
      page = page + 1;

      getChatHistory(page, pageSize)
        .then(resp => {
          this.chatHistory = resp.messages.concat(this.chatHistory);
          this.page = page;
          this.hasMorePages = resp.total != this.chatHistory.length;
        });
    },
    pad(num) {
      if (num > 9) return num;
      return `0${num}`;
    },
    getTime(timestamp) {
      let date = new Date(timestamp);
      const timeString = `${this.pad(date.getHours())}:${this.pad(
        date.getMinutes()
      )}:${this.pad(date.getSeconds())}`;

      if (date.getDate() == new Date().getDate()) {
        return timeString;
      }
      return `${date.toLocaleDateString()} ${timeString}`;
    },
    sendMessage() {
      const message = { message: this.message };
      this.socket.emit("chat", message);
      this.message = '';
      this.scrollToBottomOfHistory();
    },
    setUsername(username=undefined) {
      if (this.temporaryUsername) {
        username = this.temporaryUsername;
      }
      const message = { username: username };
      this.socket.emit("username", message);
    },
    removeUsername() {
      this.username = null;
      this.temporaryUsername = null;
      window.localStorage.removeItem("username");
    },
    isScrollPositionAtBottom() {
      const { history } = this.$refs;
      if (history) {
        return history.offsetHeight + history.scrollTop >= history.scrollHeight;
      }
      return false
    },
    scrollToBottomOfHistory() {
      setTimeout(() => {
        const { history } = this.$refs;
        history.scrollTop = history.scrollHeight;
      }, 1);
    },
    scrollToMessageElement(message) {
      const elemTimestamp = this.getTime(message.timestamp);
      const self = this;
      const getTimeStamp = (elem) => elem.getElementsByClassName('timestamp')[0].innerText;
      const prevOldestMessageInNewList = (elem) => getTimeStamp(elem) == elemTimestamp;

      setTimeout(() => {
        const { history } = self.$refs;
        const childrenElements = Array.from(history.getElementsByClassName('history-message'));

        const elemInNewList = childrenElements.find(prevOldestMessageInNewList);
        history.scrollTop = elemInNewList.offsetTop - 70
      }, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "/src/styles/media-queries.scss";
@import "/src/styles/variables.scss";
h2 {
  text-align: center;
}

hr {
  display: none;

  @include mobile {
    display: block;
    width: 80%;
  }
}
.chat-container {
  height: 100%;
  width: 50%;
  position: relative;

  @include mobile {
    width: 100%;
  }
}

input {
  width: 80%;
}

.input {
  display: flex;
}


.history {
  height: 75%;
  overflow-y: scroll;
  position: relative;

  &-message {
    display: flex;
    flex-direction: column;
    margin: 0.35rem 0;
    position: relative;

    .username {
      font-weight: bold;
      font-size: 1.05rem;
      margin-right: 0.3rem;
    }
    .timestamp {
      font-size: 0.9rem;
      top: 2px;
      position: absolute;
    }
  }

  &-message:nth-of-type(2) {
    margin-top: 1rem;
  }

  & .opaque-skirt {
    width: 100%;
    position: absolute;
    height: 1rem;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      white,
      rgba(255, 255, 255, 0)
    );
  }

  & .fetch-older-history {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }

  @include mobile {
    height: 300px;
  }
}

.username-dialog {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;

  .validation-error {
    position: absolute;
    background-color: $light-red;
    color: $red;
    top: -3.5rem;
    left: 0.5rem;
    padding: 0.75rem;
    border-radius: 4px;

    &::before {
      content: '';
      position: absolute;
      top: 2.1rem;
      left: 2rem;
      width: 1rem;
      height: 1rem;
      transform: rotate(45deg);
      background-color: $light-red;
    }
  }
}

button {
  position: relative;
  display: inline-block;
  background: #b7debd;
  color: #333;
  padding: 10px 30px;
  border: 0;
  width: fit-content;
  font-size: 1rem;
  /* height: 1.5rem; */
  /* max-height: 1.5rem; */
  margin: 0 2px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.5s ease;
  -webkit-font-smoothing: antialiased;
  touch-action: manipulation;
}
</style>
