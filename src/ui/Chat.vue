<template>
  <div class="chat-container">
    <hr />
    <h2>Chat</h2>
    <div class="history" ref="history">
      <div
        v-for="(history, index) in chatHistory"
        :key="`${history.username}-${history.timestamp}-${index}`"
      >
        <span class="timestamp">[{{ getTime(history.timestamp) }}]</span>
        <span class="user-name">{{ history.username }}:</span>
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
    }
  },
  data() {
    return {
      message: "",
      temporaryUsername: null,
      username: null,
      usernameSet: false
    };
  },
  watch: {
    chatHistory: {
      handler() {
        if (this.$refs && this.$refs.history) {
          setTimeout(() => {
            this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
          }, 10);
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
