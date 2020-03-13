<template>
  <div>
    <h1>Virtuelt lotteri</h1>
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
    <div class="current-draw" v-if="currentWinnerDrawn">
      <h2>NY VINNER:</h2>
      <div
        :class="currentWinnerColor + '-ballot'"
        class="ballot-element center-new-winner"
      >
        <span v-if="currentWinnerName">{{ currentWinnerName }}</span>
        <span v-if="!currentWinnerName">{{ secondsNameLeft }}</span>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div v-if="countdownStarted && attendees.length > 0">
        <h2>Trekker ny om: {{ secondsLeft }}</h2>
      </div>
    </div>

    <h2 v-if="winners.length > 0">Vinnere</h2>
    <div class="winners" v-if="winners.length > 0">
      <div class="winner" v-for="(winner, index) in winners" :key="index">
        <div :class="winner.color + '-ballot'" class="ballot-element">
          {{ winner.name }}
        </div>
      </div>
    </div>
    <div class="attendees" v-if="attendees.length > 0">
      <h2>Deltakere</h2>
      <div class="attendee" v-for="(attendee, index) in attendees" :key="index">
        <span class="attendee-name">{{ attendee.name }}</span>
        <div class="red-ballot ballot-element small">{{ attendee.red }}</div>
        <div class="blue-ballot ballot-element small">{{ attendee.blue }}</div>
        <div class="green-ballot ballot-element small">
          {{ attendee.green }}
        </div>
        <div class="yellow-ballot ballot-element small">
          {{ attendee.yellow }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { attendees, winners } from "@/api";
import io from "socket.io-client";

export default {
  data() {
    return {
      attendees: [],
      winners: [],
      currentWinnerDrawn: false,
      currentWinnerName: null,
      currentWinnerColor: null,
      countdownStarted: false,
      secondsLeft: 15,
      secondsNameLeft: 5,
      socket: null,
      attendeesFetched: false,
      winnersFetched: false
    };
  },
  mounted() {
    this.getAttendees();
    this.getWinners();
    this.socket = io(`${window.location.hostname}:${window.location.port}`);
    this.socket.on("color_winner", msg => {
      this.currentWinnerDrawn = true;
      this.currentWinnerColor = msg.color;
    });

    this.socket.on("winner", async msg => {
      this.currentWinnerDrawn = true;
      this.countdown();
      setTimeout(() => {
        this.currentWinnerName = msg.name;
        this.getWinners();
        this.getAttendees();
      }, 5000);

      setTimeout(() => {
        this.currentWinnerColor = null;
        this.currentWinnerName = null;
        this.currentWinnerDrawn = false;
      }, 15000);
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
    countdown: function() {
      this.secondsLeft -= 1;
      this.secondsNameLeft -= 1;
      this.countdownStarted = true;
      if (this.secondsLeft <= 0) {
        this.secondsLeft = 15;
        this.secondsNameLeft = 5;
        this.countdownStarted = false;
        return;
      }
      setTimeout(() => {
        this.countdown();
      }, 1000);
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
        if (attendees <= 0) {
          this.secondsLeft = 0;
          this.secondsNameLeft = 0;
          this.countdown();
        }
      }
      this.attendeesFetched = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

h1,
h2 {
  text-align: center;
}
.current-draw {
  margin: auto;
}

.attendee-name {
  width: 60%;
}

.center-new-winner {
  margin: auto !important;
}

.ballot-element {
  width: 140px;
  height: 150px;
  margin: 20px 0;
  -webkit-mask-image: url(/../../public/assets/images/lodd.svg);
  background-repeat: no-repeat;
  mask-image: url(/../../public/assets/images/lodd.svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  color: #333333;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &.small {
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }

  &.green-ballot {
    background-color: $light-green;
  }

  &.blue-ballot {
    background-color: $light-blue;
  }

  &.yellow-ballot {
    background-color: $light-yellow;
  }

  &.red-ballot {
    background-color: $light-red;
  }
}

.winners {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.attendees {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.attendee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  margin: 0 auto;
}
</style>
