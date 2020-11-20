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
    >Her var det lite.. Sikker på at det er en virtuell trekning nå?</h2>
    <div class="title-info">
      <h2>Send vipps med melding "Vinlotteri" for å bli registrert til virtuelt lotteri</h2>
      <p>Send gjerne melding om fargeønsker også</p>
    </div>

    <router-link to="/dagens" class="generate-link" v-if="todayExists">
      Lurer du på dagens fangst?
      <span class="subtext generator-link">Se her</span>
    </router-link>

    <hr />

    <h2>Live oversikt av lodd kjøp i dag</h2>
    <div class="colors">
      <div v-for="color in Object.keys(ticketsBought)" :class="color + ' colors-box'" :key="color">
        <div class="colors-overlay">
          <p>{{ ticketsBought[color] }} kjøpt</p>
        </div>
      </div>
    </div>

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
        :historyPageSize="historyPageSize"
        :usernameAllowed="usernameAllowed"
        @loadMoreHistory="loadMoreHistory"
        @message="sendMessage"
        @username="setUsername"
      />
    </div>
    <Vipps class="vipps" :amount="1" />
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import { attendees, winners, getChatHistory, prelottery } from "@/api";
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
      historyPage: 0,
      historyPageSize: 100,
      lastHistoryPage: false,
      usernameAccepted: false,
      username: null,
      wasDisconnected: false,
      emitUsernameOnConnect: false,
      ticketsBought: {}
    };
  },
  created() {
    getChatHistory(0, this.historyPageSize)
      .then(messages => this.chatHistory = messages);
  },
  mounted() {
    this.track();
    this.getAttendees();
    this.getWinners();
    const BASE_URL = __APIURL__ || window.location.origin;
    this.socket = io(`${BASE_URL}`);
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
  computed: {
    todayExists: () => {
      return prelottery()
        .then(wines => wines.length > 0)
        .catch(() => false);
    }
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
    loadMoreHistory: function() {
      const { historyPage, historyPageSize } = this;
      const page = historyPage + 1;

      getChatHistory(page * historyPageSize, historyPageSize)
        .then(messages => {
          this.chatHistory = messages.concat(this.chatHistory);
          this.historyPage = page;
        });
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
        if (this.attendees == undefined || this.attendees.length == 0) {
          this.attendeesFetched = true;
          return;
        }
        const addValueOfListObjectByKey = (list, key) =>
          list.map(object => object[key]).reduce((a, b) => a + b);

        this.ticketsBought = {
          red: addValueOfListObjectByKey(response, "red"),
          blue: addValueOfListObjectByKey(response, "blue"),
          green: addValueOfListObjectByKey(response, "green"),
          yellow: addValueOfListObjectByKey(response, "yellow")
        };
      }
      this.attendeesFetched = true;
    },
    track() {
      this.$ga.page("/lottery/game");
    }
  }
};
</script>

<!-- TODO move link styling to global with more generic name -->
<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";
.generate-link {
  color: #333333;
  text-decoration: none;
  display: block;
  width: 100vw;
  text-align: center;
  margin-bottom: 0px;

  @include mobile {
    width: 60vw;
    margin: auto;
  }
}

.vipps-image {
  width: 250px;
  margin: auto;
  display: block;
  margin-top: 30px;
}

.generator-link {
  font-weight: bold;
  border-bottom: 1px solid $link-color;
}
</style>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";
.color-selector {
  margin-bottom: 0.65rem;
  margin-right: 1rem;

  @include desktop {
    min-width: 175px;
  }

  @include mobile {
    max-width: 25vw;
  }

  .active {
    border: 2px solid unset;

    &.green {
      border-color: $green;
    }
    &.blue {
      border-color: $dark-blue;
    }
    &.red {
      border-color: $red;
    }
    &.yellow {
      border-color: $dark-yellow;
    }
  }

  button {
    border: 2px solid transparent;
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: row;
    height: 2.5rem;
    width: 2.5rem;

    // disable-dbl-tap-zoom
    touch-action: manipulation;

    @include mobile {
      margin: 2px;
    }

    &.green {
      background: #c8f9df;
    }
    &.blue {
      background: #d4f2fe;
    }
    &.red {
      background: #fbd7de;
    }
    &.yellow {
      background: #fff6d6;
    }
  }
}

.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;

  @include mobile {
    margin: 1.8rem auto 0;
  }

  .label-div {
    margin-top: 0.5rem;
    width: 100%;
  }
}

.colors-box {
  width: 150px;
  height: 150px;
  margin: 20px;
  -webkit-mask-image: url(/public/assets/images/lodd.svg);
  background-repeat: no-repeat;
  mask-image: url(/public/assets/images/lodd.svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  @include mobile {
    width: 120px;
    height: 120px;
    margin: 10px;
  }
}

.colors-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 0.25rem;
  position: relative;

  p {
    width: 70%;
    border: 0;
    padding: 0;
    font-size: 1.5rem;
    height: unset;
    max-height: unset;

    @include mobile {
      font-size: 1.3rem;
    }
  }
}

.green,
.green .colors-overlay > input {
  background-color: $light-green;
  color: $green;
}

.blue,
.blue .colors-overlay > input {
  background-color: $light-blue;
  color: $blue;
}

.yellow,
.yellow .colors-overlay > input {
  background-color: $light-yellow;
  color: $yellow;
}

.red,
.red .colors-overlay > input {
  background-color: $light-red;
  color: $red;
}
</style>

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

.title-info {
  width: 100%;
  text-align: center;
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
