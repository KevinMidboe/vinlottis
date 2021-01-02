<template>
  <div>
    <header ref="header">
      <div class="container">
        <div class="instructions">
          <h1 class="title">Virtuelt lotteri</h1>
          <ol>
            <li>Vurder om du ønsker å bruke <router-link to="/generate" class="vin-link">loddgeneratoren</router-link>, eller sjekke ut <router-link to="/dagens" class="vin-link">dagens fangst.</router-link></li>
            <li>Send vipps med melding "Vinlotteri" for å bli registrert til lotteriet.</li>
            <li>Send gjerne melding om fargeønske også.</li>
          </ol>
        </div>

        <Vipps :amount="1" class="vipps-qr desktop-only" />

        <VippsPill class="vipps-pill mobile-only" />

         <p class="call-to-action">
            <span class="vin-link">Følg med på utviklingen</span> og <span class="vin-link">chat om trekningen</span>
            <i class="icon icon--arrow-left" @click="scrollToContent"></i></p>
      </div>
    </header>

    <div class="container" ref="content">
      <WinnerDraw
        :currentWinnerDrawn="currentWinnerDrawn"
        :currentWinner="currentWinner"
        :attendees="attendees"
      />

      <div class="todays-raffles">
        <h2>Liste av lodd kjøpt i dag</h2>

        <div class="raffle-container">
          <div v-for="color in Object.keys(ticketsBought)" :class="color + '-raffle raffle-element'" :key="color">
            <span>{{ ticketsBought[color] }}</span>
          </div>
        </div>
      </div>

      <Winners :winners="winners" class="winners" :drawing="currentWinner" />

      <div class="container-attendees">
        <h2>Deltakere ({{ attendees.length }})</h2>
        <Attendees :attendees="attendees" class="attendees" />
      </div>

      <div class="container-chat">
        <h2>Chat</h2>
        <Chat class="chat" />
      </div>
    </div>

    <div class="container wines-container">
      <h2>Dagens fangst</h2>
      <Wine :wine="wine" v-for="wine in wines" :key="wine" />
    </div>
  </div>
</template>

<script>
import { attendees, winners, prelottery } from "@/api";
import Chat from "@/ui/Chat";
import Vipps from "@/ui/Vipps";
import VippsPill from "@/ui/VippsPill";
import Attendees from "@/ui/Attendees";
import Wine from "@/ui/Wine";
import Winners from "@/ui/Winners";
import WinnerDraw from "@/ui/WinnerDraw";
import io from "socket.io-client";

export default {
  components: { Chat, Attendees, Winners, WinnerDraw, Vipps, VippsPill, Wine },
  data() {
    return {
      attendees: [],
      winners: [],
      wines: [],
      currentWinnerDrawn: false,
      currentWinner: null,
      socket: null,
      attendeesFetched: false,
      wasDisconnected: false,
      ticketsBought: {}
    };
  },
  mounted() {
    this.track();
    this.getAttendees();
    this.getTodaysWines();
    this.getWinners();
    this.socket = io(window.location.origin);
    this.socket.on("color_winner", msg => {});

    this.socket.on("disconnect", msg => {
      this.wasDisconnected = true;
    });

    this.socket.on("winner", async msg => {
      this.currentWinnerDrawn = true;
      this.currentWinner = {
        name: msg.name,
        color: msg.color,
        winnerCount: msg.winner_count
      };

      setTimeout(() => {
        this.getWinners();
        this.getAttendees();
        this.currentWinner = null;
        this.currentWinnerDrawn = false;
      }, 19250);
    });
    this.socket.on("refresh_data", async msg => {
      this.getAttendees();
      this.getWinners();
    });
    this.socket.on("new_attendee", async msg => {
      this.getAttendees();
    });
  },
  beforeDestroy() {
    this.socket.disconnect();
    this.socket = null;
  },
  methods: {
    getWinners: async function() {
      let response = await winners();
      if (response) {
        this.winners = response;
      }
    },
    getTodaysWines() {
      prelottery()
        .then(wines => {
          this.wines = wines;
          this.todayExists = wines.length > 0;
        })
        .catch(_ => this.todayExists = false)
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
    scrollToContent() {
      console.log(window.scrollY)
      const intersectingHeaderHeight = this.$refs.header.getBoundingClientRect().bottom - 50;
      const { scrollY } = window;
      let scrollHeight = intersectingHeaderHeight;
      if (scrollY > 0) {
        scrollHeight = intersectingHeaderHeight + scrollY;
      }

      window.scrollTo({
        top: scrollHeight,
        behavior: "smooth"
      });
    },
    track() {
      window.ga('send', 'pageview', '/lottery/game');
    }
  }
};
</script>

<style lang="scss" scoped>

@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

.container {
  width: 80vw;
  padding: 0 10vw;

  @include mobile {
    width: 90vw;
    padding: 0 5vw;
  }

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  > div, > section {
    @include mobile {
      grid-column: span 5;
    }
  }
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 1.75rem;
}

header {
  h1 {
    text-align: left;
    font-weight: 500;
    font-size: 3rem;
    margin: 4rem 0 2rem;

    @include mobile {
      margin-top: 1rem;
      font-size: 2.75rem;
    }
  }

  background-color: $primary;
  padding-bottom: 3rem;
  margin-bottom: 3rem;

  .instructions {
    grid-column: 1 / 4;

    @include mobile {
      grid-column: span 5;
    }
  }

  .vipps-qr {
    grid-column: 4;
    margin-left: 1rem;
  }

  .vipps-pill {
    margin: 0 auto 2rem;
    max-width: 80vw;
  }

  .call-to-action {
    grid-column: span 5;
  }

  ol {
    font-size: 1.4rem;
    line-height: 3rem;
    color: $matte-text-color;

    @include mobile {
      line-height: 2rem;
    }
  }

  p {
    font-size: 1.4rem;
    line-height: 2rem;
    margin-top: 0;
    position: relative;

    .vin-link {
      cursor: default;
    }

    .icon {
      position: absolute;
      bottom: 3px;
      color: $link-color;
      margin-left: 0.5rem;
      display: inline-block;
      transform: rotate(-90deg);
      cursor: pointer;
    }
  }

  .vin-link {
    font-weight: 400;
    border-width: 2px;
  }
}

.todays-raffles {
  grid-column: 1;

  @include mobile {
    order: 2;
  }
}

.raffle-container {
  width: 165px;
  height: 175px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  @include mobile {
    width: 100%;
    height: 100%;
  }

  .raffle-element {
    font-size: 1.6rem;
    color: $matte-text-color;
    height: 75px;
    width: 75px;
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0;
  }
}

.winners {
  grid-column: 2 / 5;

  @include mobile {
    order: 1;
  }
}

.container-attendees {
  grid-column: 1 / 3;
  margin-right: 1rem;
  margin-top: 2rem;

  @include mobile {
    margin-right: 0;
    order: 4;
  }

  > div {
    padding: 1rem;

    -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  }
}

.container-chat {
  grid-column: 3 / 5;
  margin-left: 1rem;
  margin-top: 2rem;

  @include mobile {
    margin-left: 0;
    order: 3;
  }

  > div {
    padding: 1rem;

    -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
    -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  }
}


.wines-container {
  margin-bottom: 4rem;

  h2 {
    grid-column: 1 / 5;
  }
}
</style>
