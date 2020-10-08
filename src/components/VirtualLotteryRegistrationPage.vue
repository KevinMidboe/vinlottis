<template>
  <div class="page-container">
    <h1 class="title">Virtuelt lotteri registrering</h1>
    <br />
    <div class="draw-winner-container" v-if="attendees.length > 0">
      <div v-if="drawingWinner">
        <span>
          Trekker {{ currentWinners }} av {{ numberOfWinners }} vinnere.
          {{ secondsLeft }} sekunder av {{ drawTime }} igjen
        </span>
        <button class="vin-button no-margin" @click="stopDraw">Stopp trekning</button>
      </div>
      <div class="draw-container" v-if="!drawingWinner">
        <button class="vin-button no-margin" @click="drawWinner">Trekk vinnere</button>
        <input type="number" v-model="numberOfWinners" />
      </div>
    </div>
    <h2 v-if="winners.length > 0">Vinnere</h2>
    <div class="winners" v-if="winners.length > 0">
      <div class="winner" v-for="(winner, index) in winners" :key="index">
        <div :class="winner.color + '-raffle'" class="raffle-element">
          <span>{{ winner.name }}</span>
          <span>{{ winner.phoneNumber }}</span>
          <span>Rød: {{ winner.red }}</span>
          <span>Blå: {{ winner.blue }}</span>
          <span>Grønn: {{ winner.green }}</span>
          <span>Gul: {{ winner.yellow }}</span>
        </div>
      </div>
    </div>
    <div class="delete-buttons" v-if="attendees.length > 0 || winners.length > 0">
      <button
        class="vin-button"
        v-if="winners.length > 0"
        @click="deleteAllWinners"
      >Slett virtuelle vinnere</button>
      <button
        class="vin-button"
        v-if="attendees.length > 0"
        @click="deleteAllAttendees"
      >Slett virtuelle deltakere</button>
    </div>
    <div class="attendees" v-if="attendees.length > 0">
      <h2>Deltakere ({{ attendees.length }})</h2>
      <div class="attendee" v-for="(attendee, index) in attendees" :key="index">
        <div class="name-and-phone">
          <span class="name">{{ attendee.name }}</span>
          <span class="phoneNumber">{{ attendee.phoneNumber }}</span>
        </div>
        <div class="raffles-container">
          <div class="red-raffle raffle-element small">{{ attendee.red }}</div>
          <div class="blue-raffle raffle-element small">{{ attendee.blue }}</div>
          <div class="green-raffle raffle-element small">{{ attendee.green }}</div>
          <div class="yellow-raffle raffle-element small">{{ attendee.yellow }}</div>
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
        <input id="phoneNumber" type="text" placeholder="Telefonnummer" v-model="phoneNumber" />
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
      <div v-if="!randomColors">
        <br />
        <br />
        <div class="label-div">
          <label for="red">Rød</label>
          <input id="red" type="number" placeholder="Rød" v-model="red" />
        </div>
        <br />
        <div class="label-div">
          <label for="blue">Blå</label>
          <input id="blue" type="number" placeholder="Blå" v-model="blue" />
        </div>
        <br />
        <div class="label-div">
          <label for="green">Grønn</label>
          <input id="green" type="number" placeholder="Grønn" v-model="green" />
        </div>
        <br />
        <div class="label-div">
          <label for="yellow">Gul</label>
          <input id="yellow" type="number" placeholder="Gul" v-model="yellow" />
        </div>
      </div>
      <div v-else>
        <RaffleGenerator @colors="setWithRandomColors" :generateOnInit="true" />
      </div>
    </div>
    <br />
    <button class="vin-button" @click="sendAttendee">Send deltaker</button>

    <TextToast v-if="showToast" :text="toastText" v-on:closeToast="showToast = false" />
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
  deleteAttendees,
  finishedDraw,
  prelottery
} from "@/api";
import TextToast from "@/ui/TextToast";
import RaffleGenerator from "@/ui/RaffleGenerator";

export default {
  components: {
    RaffleGenerator,
    TextToast
  },
  data() {
    return {
      name: null,
      phoneNumber: null,
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      raffles: 0,
      randomColors: false,
      attendees: [],
      winners: [],
      drawingWinner: false,
      secondsLeft: 20,
      drawTime: 20,
      currentWinners: 1,
      numberOfWinners: 4,
      socket: null,
      toastText: undefined,
      showToast: false
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

    window.finishedDraw = finishedDraw;
  },
  methods: {
    setWithRandomColors(colors) {
      Object.keys(colors).forEach(color => (this[color] = colors[color]));
    },
    sendAttendee: async function() {
      if (this.red == 0 && this.blue == 0 && this.green == 0 && this.yellow == 0) {
        alert('Ingen farger valgt!')
        return;
      }
      if (this.name == 0 && this.phoneNumber) {
        alert('Ingen navn eller tlf satt!')
        return;
      }

      let response = await addAttendee({
        name: this.name,
        phoneNumber: this.phoneNumber,
        red: this.red,
        blue: this.blue,
        green: this.green,
        yellow: this.yellow,
        raffles: this.raffles
      });

      if (response == true) {
        this.toastText = `Sendt inn deltaker: ${this.name}`;
        this.showToast = true;

        this.name = null;
        this.phoneNumber = null;
        this.yellow = 0;
        this.green = 0;
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
      if (window.confirm("Er du sikker på at du vil trekke vinnere?")) {
        this.drawingWinner = true;
        let response = await getVirtualWinner();

        if (response) {
          if (this.currentWinners < this.numberOfWinners) {
            this.countdown();
          } else {
            this.drawingWinner = false;
            let finished = await finishedDraw();
            if(finished) {
              alert("SMS'er er sendt ut!");
            } else {
              alert("Noe gikk galt under SMS utsendelser.. Sjekk logg og database for id'er.");
            }
          }
          this.getWinners();
          this.getAttendees();
        } else {
          this.drawingWinner = false;
          alert("Noe gikk galt under trekningen..!");
        }
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
      if (window.confirm("Er du sikker på at du vil slette vinnere?")) {
        let response = await deleteWinners();
        if (response) {
          this.getWinners();
        } else {
          alert("Klarte ikke hente ut vinnere");
        }
      }
    },
    deleteAllAttendees: async function() {
      if (window.confirm("Er du sikker på at du vil slette alle deltakere?")) {
        let response = await deleteAttendees();
        if (response) {
          this.getAttendees();
        } else {
          alert("Klarte ikke hente ut vinnere");
        }
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

.raffle-element {
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

  &.green-raffle {
    background-color: $light-green;
  }

  &.blue-raffle {
    background-color: $light-blue;
  }

  &.yellow-raffle {
    background-color: $light-yellow;
  }

  &.red-raffle {
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
  & .raffles-container {
    display: flex;
    justify-content: center;
  }

  & .name-and-phone {
    flex-direction: column;
  }

  & .raffles-container {
    flex-direction: row;
  }
}
</style>
