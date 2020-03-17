<template>
  <div>
    <h1 class="title">Virtuelt lotteri</h1>
    <h2
      v-if="
        attendees.length <= 0 &&
          winners.length <= 0 &&
          attendeesFetched &&
          winnersFetched
      "
    >
      Her var det lite.. Sikker på at det er en virtuell trekning nå?
    </h2>
    <WinnerDraw
      :currentWinnerDrawn="currentWinnerDrawn"
      :currentWinner="currentWinner"
      :attendees="attendees"
    />

    <Winners :winners="winners" />
    <hr />
    <div class="middle-elements">
      <Attendees :attendees="attendees" class="outer-attendees" />
      <Chat
        class="outer-chat"
        :chatHistory="chatHistory"
        :usernameAllowed="usernameAllowed"
        v-on:message="sendMessage"
        v-on:username="setUsername"
      />
    </div>
    <Vipps class="vipps" :amount="1" />
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import { attendees, winners, getChatHistory } from "@/api";
import Chat from "@/ui/Chat";
import Vipps from "@/ui/Vipps";
import Attendees from "@/ui/Attendees";
import Winners from "@/ui/Winners";
import WinnerDraw from "@/ui/WinnerDraw";
import io from "socket.io-client";

export default {
  components: { Chat, Attendees, Winners, WinnerDraw, Vipps },
  data() {
    return {
      attendees: [],
      winners: [],
      currentWinnerDrawn: false,
      currentWinner: {},
      socket: null,
      attendeesFetched: false,
      winnersFetched: false,
      chatHistory: [],
      usernameAccepted: false,
      username: null,
      wasDisconnected: false,
      emitUsernameOnConnect: false
    };
  },
  created() {
    getChatHistory()
      .then(messages => this.chatHistory = messages)
  },
  mounted() {
    this.track();
    this.getAttendees();
    this.getWinners();
    this.socket = io(`${window.location.hostname}:${window.location.port}`);
    this.socket.on("color_winner", msg => {});

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

    this.socket.on("winner", async msg => {
      this.currentWinnerDrawn = true;
      this.currentWinner = { name: msg.name, color: msg.color };

      setTimeout(() => {
        this.getWinners();
        this.getAttendees();
        this.currentWinner = null;
        this.currentWinnerDrawn = false;
      }, 12000);
    });
    this.socket.on("refresh_data", async msg => {
      this.getAttendees();
      this.getWinners();
    });
    this.socket.on("new_attendee", async msg => {
      this.getAttendees();
    });
    this.socket.on("accept_username", accepted => {
      this.usernameAccepted = accepted;
      if (!accepted) {
        this.username = null;
      } else {
        window.localStorage.setItem("username", this.username);
      }
    });
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.socket = null;
  },
  methods: {
    setUsername: function(username) {
      this.username = username;
      if (!this.socket || !this.socket.emit) {
        this.emitUsernameOnConnect = true;
        return;
      }
      this.socket.emit("username", { username });
    },
    sendMessage: function(msg) {
      this.socket.emit("chat", { message: msg });
    },
    getWinners: async function() {
      let response = await winners();
      if (response) {
        this.winners = response;
      }
      this.winnersFetched = true;
    },
    getAttendees: async function() {
      let response = await attendees();
      if (response) {
        this.attendees = response;
      }
      this.attendeesFetched = true;
    },
    track() {
      this.$ga.page("/lottery/game");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";
hr {
  width: 80%;
}
h1,
h2 {
  text-align: center;
}
.current-draw {
  margin: auto;
}

.outer-chat {
  margin: 0 60px 0 10px;
  @include mobile {
    margin: 0;
  }
}

.outer-attendees {
  margin: 0 10px 0 45px;
  @include mobile {
    margin: 0;
  }
}

.center-new-winner {
  margin: auto !important;
}

.middle-elements {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;

  @include mobile {
    height: auto;
    flex-direction: column;
  }
}

.vipps {
  margin-top: 70px;
  display: flex;
  padding-bottom: 50px;
  justify-content: center;
  @include mobile {
    flex-direction: column;
  }
}
</style>
