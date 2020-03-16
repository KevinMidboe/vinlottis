<template>
  <div class="page-container">
    <h1 class="title">Virtuelt lotteri registrering</h1>
    <br />
    <div class="draw-winner-container" v-if="attendees.length > 0">
      <div v-if="drawingWinner">
        <span
          >Trekker {{ currentWinners }} av {{ numberOfWinners }} vinnere.
          {{ secondsLeft }} sekunder av {{ drawTime }} igjen</span
        >
        <button class="vin-button no-margin" @click="stopDraw">
          Stopp trekning
        </button>
      </div>
      <div class="draw-container" v-if="!drawingWinner">
        <button class="vin-button no-margin" @click="drawWinner">
          Trekk vinnere
        </button>
        <input type="number" v-model="numberOfWinners" />
      </div>
    </div>
    <h2 v-if="winners.length > 0">Vinnere</h2>
    <div class="winners" v-if="winners.length > 0">
      <div class="winner" v-for="(winner, index) in winners" :key="index">
        <div :class="winner.color + '-ballot'" class="ballot-element">
          <span>{{ winner.name }}</span>
          <span>{{ winner.phoneNumber }}</span>
        </div>
      </div>
    </div>
    <div
      class="delete-buttons"
      v-if="attendees.length > 0 || winners.length > 0"
    >
      <button
        class="vin-button"
        v-if="winners.length > 0"
        @click="deleteAllWinners"
      >
        Slett virtuelle vinnere
      </button>
      <button
        class="vin-button"
        v-if="attendees.length > 0"
        @click="deleteAllAttendees"
      >
        Slett virtuelle deltakere
      </button>
    </div>
    <div class="attendees" v-if="attendees.length > 0">
      <h2>Deltakere ({{ attendees.length }})</h2>
      <div class="attendee" v-for="(attendee, index) in attendees" :key="index">
        <div class="name-and-phone">
          <span class="name">{{ attendee.name }}</span>
          <span class="phoneNumber">{{ attendee.phoneNumber }}</span>
        </div>
        <div class="ballots-container">
          <div class="red-ballot ballot-element small">{{ attendee.red }}</div>
          <div class="blue-ballot ballot-element small">
            {{ attendee.blue }}
          </div>
          <div class="green-ballot ballot-element small">
            {{ attendee.green }}
          </div>
          <div class="yellow-ballot ballot-element small">
            {{ attendee.yellow }}
          </div>
        </div>
      </div>
    </div>
    <div class="attendee-registration-container">
      <h2>Legg til deltaker</h2>
      <div class="label-div">
        <label for="name">Navn</label>
        <input id="name" type="text" placeholder="Navn" v-model="name" />
      </div>
      <br />
      <div class="label-div">
        <label for="phoneNumber">Telefonnummer</label>
        <input
          id="phoneNumber"
          type="text"
          placeholder="Telefonnummer"
          v-model="phoneNumber"
        />
      </div>
      <br />
      <br />
      <div class="label-div">
        <label for="randomColors">Tilfeldig farger?</label>
        <input
          id="randomColors"
          type="checkbox"
          placeholder="Tilfeldig farger"
          v-model="randomColors"
        />
      </div>
      <br />
      <br />
      <div v-if="!randomColors">
        <div class="label-div">
          <label for="red">Rød</label>
          <input id="red" type="number" placeholder="Rød" v-model="red" />
        </div>
        <div class="label-div">
          <label for="blue">Blå</label>
          <input id="blue" type="number" placeholder="Blå" v-model="blue" />
        </div>
        <div class="label-div">
          <label for="green">Grønn</label>
          <input id="green" type="number" placeholder="Grønn" v-model="green" />
        </div>
        <div class="label-div">
          <label for="yellow">Gul</label>
          <input id="yellow" type="number" placeholder="Gul" v-model="yellow" />
        </div>
      </div>
      <div v-if="randomColors">
        <div class="label-div">
          <label for="ballots">Antall lodd</label>
          <input
            id="ballots"
            type="number"
            placeholder="Antall lodd"
            v-model="ballots"
          />
        </div>
      </div>
    </div>
    <br />
    <button class="vin-button" @click="sendAttendee">Send deltaker</button>
  </div>
</template>

<script>
import io from "socket.io-client";
import {
  addAttendee,
  getVirtualWinner,
  attendeesSecure,
  attendees,
  winnersSecure,
  deleteWinners,
  deleteAttendees
} from "@/api";

export default {
  data() {
    return {
      name: null,
      phoneNumber: null,
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      ballots: 0,
      randomColors: false,
      attendees: [],
      winners: [],
      drawingWinner: false,
      secondsLeft: 20,
      drawTime: 20,
      currentWinners: 1,
      numberOfWinners: 4,
      socket: null
    };
  },
  mounted() {
    this.getAttendees();
    this.getWinners();

    this.socket = io(`${window.location.hostname}:${window.location.port}`);

    this.socket.on("winner", async msg => {
      this.getWinners();
      this.getAttendees();
    });

    this.socket.on("refresh_data", async msg => {
      this.getAttendees();
      this.getWinners();
    });

    this.socket.on("new_attendee", async msg => {
      this.getAttendees();
    });
  },
  methods: {
    sendAttendee: async function() {
      let response = await addAttendee({
        name: this.name,
        phoneNumber: this.phoneNumber,
        red: this.red,
        blue: this.blue,
        green: this.green,
        yellow: this.yellow,
        ballots: this.ballots,
        randomColors: this.randomColors
      });
      if (response == true) {
        alert("Sendt inn deltaker!");
        this.name = null;
        this.phoneNumber = null;
        this.red = 0;
        this.blue = 0;

        this.getAttendees();
      } else {
        alert("Klarte ikke sende inn.. Er du logget inn?");
      }
    },
    getAttendees: async function() {
      let response = await attendeesSecure();
      this.attendees = response;
    },
    stopDraw: function() {
      this.drawingWinner = false;
      this.secondsLeft = this.drawTime;
    },
    drawWinner: async function() {
      this.drawingWinner = true;
      let response = await getVirtualWinner();
      if (response) {
        if (this.currentWinners < this.numberOfWinners) {
          this.countdown();
        } else {
          this.drawingWinner = false;
        }
        this.getWinners();
        this.getAttendees();
      } else {
        this.drawingWinner = false;
        alert("Noe gikk galt under trekningen..!");
      }
    },
    countdown: function() {
      this.secondsLeft -= 1;
      if (!this.drawingWinner) {
        return;
      }
      if (this.secondsLeft <= 0) {
        this.secondsLeft = this.drawTime;
        this.currentWinners += 1;
        if (this.currentWinners <= this.numberOfWinners) {
          this.drawWinner();
        } else {
          this.drawingWinner = false;
        }
        return;
      }
      setTimeout(() => {
        this.countdown();
      }, 1000);
    },
    deleteAllWinners: async function() {
      let response = await deleteWinners();
      if (response) {
        this.getWinners();
      } else {
        alert("Klarte ikke hente ut vinnere");
      }
    },
    deleteAllAttendees: async function() {
      let response = await deleteAttendees();
      if (response) {
        this.getAttendees();
      } else {
        alert("Klarte ikke hente ut vinnere");
      }
    },
    getWinners: async function() {
      let response = await winnersSecure();
      if (response) {
        this.winners = response;
      } else {
        alert("Klarte ikke hente ut vinnere");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.draw-container {
  display: flex;
  justify-content: space-around;
}

.draw-winner-container,
.delete-buttons {
  margin-bottom: 20px;
}

.delete-buttons {
  display: flex;
}

h1 {
  width: 100%;
  text-align: center;
  font-family: knowit, Arial;
}

h2 {
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  font-family: knowit, Arial;
}

hr {
  width: 90%;
  margin: 2rem auto;
  color: grey;
}

.page-container {
  padding: 0 1.5rem 3rem;

  @include desktop {
    max-width: 60vw;
    margin: 0 auto;
  }
}

#randomColors {
  width: 40px;
  height: 40px;
  &:checked {
    background: green;
  }
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
  flex-direction: column;

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

button {
  display: flex !important;
  margin: auto !important;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  margin: 0 auto;

  & .name-and-phone,
  & .ballots-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .name-and-phone {
    flex-direction: column;
  }

  & .ballots-container {
    flex-direction: row;
  }
}
</style>
