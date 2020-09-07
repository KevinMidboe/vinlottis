<template>
  <div class="page-container">
    <h2 class="margin-top-md">Send inn antall lodd og pris kjøpt for</h2>
    <h3 class="margin-top-md">Legg til lodd kjøpt</h3>
    <div class="colors">
      <div v-for="color in lotteryColors" :class="color.css + ' colors-box'" :key="color">
        <div class="colors-overlay">
          <p>{{ color.name }} kjøpt</p>
          <input v-model="color.value" min="0" :placeholder="0" type="number" />
        </div>
      </div>

      <div class="label-div">
        <label>Totalt kjøpt for:</label>
        <input v-model="payed" placeholder="NOK" type="number" :step="price || 1" min="0" />
      </div>
    </div>

    <div class="button-container">
      <button class="vin-button" @click="submitLottery">Send inn lotteri</button>
    </div>

    <h2 class="margin-top-md">Send inn vinnere av lotteri</h2>
    <h3>Vinnere</h3>
    <a class="wine-link" @click="fetchColorsAndWinners()">Refresh data fra virtuelt lotteri</a>
    
    <div class="winner-container" v-if="winners.length > 0">
      <wine v-for="winner in winners" :key="winner" :wine="winner.wine" :inlineSlot="true">
        <div class="winner-element">
          <div class="color-selector">
            <div class="label-div">
              <label>Farge vunnet</label>
            </div>
            <button
              class="blue"
              :class="{ active: winner.color == 'blue' }"
              @click="winner.color = 'blue'"
            ></button>
            <button
              class="red"
              :class="{ active: winner.color == 'red' }"
              @click="winner.color = 'red'"
            ></button>
            <button
              class="green"
              :class="{ active: winner.color == 'green' }"
              @click="winner.color = 'green'"
            ></button>
            <button
              class="yellow"
              :class="{ active: winner.color == 'yellow' }"
              @click="winner.color = 'yellow'"
            ></button>
          </div>
          <div class="label-div">
            <label for="winner-name">Navn vinner</label>
            <input id="winner-name" type="text" placeholder="Navn" v-model="winner.name" />
          </div>
        </div>
        <div class="label-div">
          <label for="potential-winner-name">Virtuelle vinnere</label>
          <select
            id="potential-winner-name"
            type="text"
            placeholder="Navn"
            v-model="winner.potentialWinner"
            @change="potentialChange($event, winner)"
          >
            <option
              v-for="fetchedWinner in fetchedWinners"
              :value="stringify(fetchedWinner)"
            >{{fetchedWinner.name}}</option>
          </select>
        </div>
      </wine>

      <div class="button-container column">
        <button class="vin-button" @click="submitLotteryWinners">Send inn vinnere</button>
        <button class="vin-button" @click="resetWinnerDataInStorage">Reset local wines</button>
      </div>
    </div>
    <p v-else>Alle vinnere er blitt registert 👍</p>
  </div>
</template>

<script>
import eventBus from "@/mixins/EventBus";
import { dateString } from '@/utils'
import {
  prelottery,
  sendLotteryWinners,
  sendLottery,
  logWines,
  wineSchema,
  winnersSecure,
  attendees
} from "@/api";
import TextToast from "@/ui/TextToast";
import Wine from "@/ui/Wine";
import ScanToVinmonopolet from "@/ui/ScanToVinmonopolet";

export default {
  components: { TextToast, Wine, ScanToVinmonopolet },
  data() {
    return {
      winners: [],
      drawingWinner: false,
      secondsLeft: 20,
      drawTime: 20,
      currentWinners: 1,
      numberOfWinners: 4,
      socket: null,

      payed: undefined,
      winners: [],
      fetchedWinners: [],

      lotteryColors: [
        { value: null, name: "Blå", css: "blue" },
        { value: null, name: "Rød", css: "red" },
        { value: null, name: "Grønn", css: "green" },
        { value: null, name: "Gul", css: "yellow" }
      ],
      price: __PRICE__
    };
  },
  created() {
    this.fetchAndAddPrelotteryWines().then(this.getWinnerdataFromStorage);

    window.addEventListener("unload", this.setWinnerdataToStorage);
  },
  beforeDestroy() {
    this.setWinnerdataToStorage();
    eventBus.$off("tab-change", () => {
      this.fetchColorsAndWinners();
    });
  },
  mounted() {
    this.fetchColorsAndWinners();

    eventBus.$on("tab-change", () => {
      this.fetchColorsAndWinners();
    });
  },
  methods: {
    stringify(json) {
      return JSON.stringify(json);
    },
    potentialChange(event, winner) {
      let data = JSON.parse(event.target.value);
      winner.name = data.name;
      winner.color = data.color;
    },
    async fetchColorsAndWinners() {
      let winners = await winnersSecure();
      let _attendees = await attendees();
      let colors = {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0
      };
      this.payed = 0;
      for (let i = 0; i < _attendees.length; i++) {
        let attendee = _attendees[i];
        colors.red += attendee.red;
        colors.blue += attendee.blue;
        colors.green += attendee.green;
        colors.yellow += attendee.yellow;
        this.payed +=
          (attendee.red + attendee.blue + attendee.green + attendee.yellow) *
          10;
      }

      for (let i = 0; i < this.lotteryColors.length; i++) {
        let currentColor = this.lotteryColors[i];
        switch (currentColor.css) {
          case "red":
            currentColor.value = colors.red;
            break;
          case "blue":
            currentColor.value = colors.blue;
            break;
            a;
          case "green":
            currentColor.value = colors.green;
            break;
          case "yellow":
            currentColor.value = colors.yellow;
            break;
        }
      }
      this.fetchedWinners = winners;
    },
    async fetchAndAddPrelotteryWines() {
      const wines = await prelottery();

      for (let i = 0; i < wines.length; i++) {
        let wine = wines[i];
        this.winners.push({
          name: "",
          color: "",
          potentialWinner: "",
          wine: {
            name: wine.name,
            vivinoLink: wine.vivinoLink,
            rating: wine.rating,
            image: wine.image,
            id: wine.id
          }
        });
      }
    },
    submitLottery: async function(event) {
      const colors = {
        red: this.lotteryColors.filter(c => c.css == "red")[0].value,
        green: this.lotteryColors.filter(c => c.css == "green")[0].value,
        blue: this.lotteryColors.filter(c => c.css == "blue")[0].value,
        yellow: this.lotteryColors.filter(c => c.css == "yellow")[0].value
      };

      let sendObject = {
        lottery: {
          date: dateString(new Date()),
          ...colors
        }
      };

      if (sendObject.lottery.red == undefined) {
        alert("Rød må defineres");
        return;
      }
      if (sendObject.lottery.green == undefined) {
        alert("Grønn må defineres");
        return;
      }
      if (sendObject.lottery.yellow == undefined) {
        alert("Gul må defineres");
        return;
      }
      if (sendObject.lottery.blue == undefined) {
        alert("Blå må defineres");
        return;
      }

      sendObject.lottery.bought =
        parseInt(colors.blue) +
        parseInt(colors.red) +
        parseInt(colors.green) +
        parseInt(colors.yellow);
      const stolen = sendObject.lottery.bought - parseInt(this.payed) / 10;
      if (isNaN(stolen) || stolen == undefined) {
        alert("Betalt må registreres");
        return;
      }
      sendObject.lottery.stolen = stolen;

      let response = await sendLottery(sendObject);
      if (response == true) {
        alert("Sendt!");
        window.location.reload();
      } else {
        alert(response.message || "Noe gikk galt under innsending");
      }
    },
    submitLotteryWinners: async function(event) {
      let sendObject = {
        lottery: {
          date: dateString(new Date()),
          winners: this.winners
        }
      }

      if (sendObject.lottery.winners.length == 0) {
        alert("Det må være med vinnere");
        return;
      }
      for (let i = 0; i < sendObject.lottery.winners.length; i++) {
        let currentWinner = sendObject.lottery.winners[i];

        if (currentWinner.name == undefined || currentWinner.name == "") {
          alert("Navn må defineres");
          return;
        }
        if (currentWinner.color == undefined || currentWinner.color == "") {
          alert("Farge må defineres");
          return;
        }
      }

      let response = await sendLotteryWinners(sendObject);
      if (response == true) {
        alert("Sendt!");
        window.location.reload();
      } else {
        alert(response.message || "Noe gikk galt under innsending");
      }
    },
    getWinnerdataFromStorage() {
      let localWinners = localStorage.getItem("winners");
      if (localWinners && this.winners.length) {
        localWinners = JSON.parse(localWinners);

        this.winners = this.winners.map(winner => {
          const localWinnerMatch = localWinners.filter(
            localWinner =>
              localWinner.wine.name == winner.wine.name ||
              localWinner.wine.id == winner.wine.id
          );

          if (localWinnerMatch.length > 0) {
            winner.name = localWinnerMatch[0].name || winner.name;
            winner.color = localWinnerMatch[0].color || winner.name;
          }

          return winner;
        });
      }

      let localColors = localStorage.getItem("colorValues");
      if (localColors) {
        localColors = localColors.split(",");
        this.lotteryColors.forEach((color, i) => {
          const localColorValue = Number(localColors[i]);
          color.value = localColorValue == 0 ? null : localColorValue;
        });
      }
    },
    setWinnerdataToStorage() {
      localStorage.setItem("winners", JSON.stringify(this.winners));
      localStorage.setItem(
        "colorValues",
        this.lotteryColors.map(color => Number(color.value))
      );
      window.removeEventListener("unload", this.setWinnerdataToStorage);
    },
    resetWinnerDataInStorage() {
      this.winners = [];
      this.fetchAndAddPrelotteryWines().then(resp => (this.winners = resp));
      this.lotteryColors.map(color => (color.value = null));
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1400px;
  margin: 3rem auto 1rem;

  @include mobile {
    margin: 1.8rem auto 0;
  }

  .label-div {
    margin-top: 0.5rem;
    width: 100%;
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

  &-box {
    width: 150px;
    height: 150px;
    margin: 20px;
    -webkit-mask-image: url(/../../public/assets/images/lodd.svg);
    background-repeat: no-repeat;
    mask-image: url(/../../public/assets/images/lodd.svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;

    @include mobile {
      width: 120px;
      height: 120px;
      margin: 10px;
    }
  }

  &-overlay {
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 0 0.5rem;
    position: relative;

    p {
      margin: 0;
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      font-weight: 600;
      position: absolute;
      top: 0.4rem;
      left: 0.5rem;
    }

    input {
      width: 70%;
      border: 0;
      padding: 0;
      font-size: 3rem;
      height: unset;
      max-height: unset;
      position: absolute;
      bottom: 1.5rem;
    }
  }
}

.winner-container {
  width: max-content;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .button-container {
    width: 100%;
  }
}

.winner-element {
  display: flex;
  flex-direction: row;

  @include desktop {
    margin-top: 1.5rem;
  }

  @include mobile {
    width: 100%;
  }
}

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

select {
  margin: 0 0 auto;
  height: 2rem;
  min-width: 0;
  width: 98%;
  padding: 1%;
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

.page-container {
  padding: 0 1.5rem 3rem;

  @include desktop {
    max-width: 60vw;
    margin: 0 auto;
  }
}
</style>
