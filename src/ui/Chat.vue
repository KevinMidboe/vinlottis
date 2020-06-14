<template>
  <div class="chat-container">
    <hr />
    <h2>Chat</h2>
    <div class="history" ref="history">
      <div class="opaque-skirt"></div>
      <div v-if="existsMore" class="fetch-older-history">
        <button @click="$emit('loadMoreHistory')">Hent eldre meldinger</button>
      </div>
      <div class="history-message"
        v-for="(history, index) in chatHistory"
        :key="`${history.username}-${history.timestamp}-${index}`"
      >
        <div>
          <span class="user-name">{{ history.username }}</span>
          <span class="timestamp">{{ getTime(history.timestamp) }}</span>
        </div>
        <span class="message">{{ history.message }}</span>
      </div>
    </div>
    <div v-if="usernameSet" class="input">
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
      <button @click="setUsername">Lagre brukernavn</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    usernameAllowed: {
      type: Boolean
    },
    chatHistory: {
      type: Array
    },
    historyPageSize: {
      type: Number
    }
  },
  data() {
    return {
      message: "",
      temporaryUsername: null,
      username: null,
      usernameSet: false,
      existsMore: true
    };
  },
  watch: {
    chatHistory: {
      handler: function(newVal, oldVal) {
        if (this.$refs && this.$refs.history) {
          const firstMessages = oldVal.length == 0;
          const diffLargerThanOne = newVal.length - oldVal.length > 1;

          setTimeout(() => {
            if (firstMessages || diffLargerThanOne == false) {
              this.scrollToBottomOfHistory();
            } else {
              this.scrollToStartOfNewMessages();
              // what shows the load more button - if we scroll page and less than page size
              // come back we have reached a limit
              this.existsMore = newVal.length - oldVal.length == this.historyPageSize
            }
          }, 100);
        }
      },
      deep: true
    }
  },
  mounted() {
    let username = window.localStorage.getItem("username");
    if (!username) {
      return;
    }
    this.username = username;
    this.usernameSet = true;
    this.$emit("username", username);
  },
  methods: {
    pad: function(num) {
      if (num > 9) return num;
      return `0${num}`;
    },
    getTime: function(timestamp) {
      let date = new Date(timestamp);
      const timeString = `${this.pad(date.getHours())}:${this.pad(
        date.getMinutes()
      )}:${this.pad(date.getSeconds())}`;

      if (date.getDate() == new Date().getDate()) {
        return timeString;
      }
      return `${date.toLocaleDateString()} ${timeString}`;
    },
    sendMessage: function() {
      this.$emit("message", this.message);
      this.message = "";
    },
    removeUsername: function() {
      this.username = null;
      this.temporaryUsername = null;
      this.usernameSet = false;
      window.localStorage.removeItem("username");
      this.$emit("username", null);
    },
    setUsername: function() {
      if (
        this.temporaryUsername.length > 3 &&
        this.temporaryUsername.length < 30
      ) {
        this.username = this.temporaryUsername;
        this.usernameSet = true;
        this.$emit("username", this.username);
      }
    },
    scrollToBottomOfHistory() {
      if (this.$refs && this.$refs.history) {
        const { history } = this.$refs;
        history.scrollTop = history.scrollHeight;
      }
    },
    scrollToStartOfNewMessages() {
      const { history } = this.$refs;
      const histLength = history.children.length;
      const pages = Math.floor(histLength / 100);

      const messageToScrollTo = history.children[histLength - ((pages * 100) + 3)]
      history.scrollTop = messageToScrollTo.offsetTop;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
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

  &-message {
    display: flex;
    flex-direction: column;
    margin: 0.35rem 0;
    position: relative;

    .user-name {
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
    margin: 0.2rem 0 0.5rem;
  }

  @include mobile {
    height: 300px;
  }
}

.username-dialog {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
