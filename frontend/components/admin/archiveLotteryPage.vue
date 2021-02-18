<template>
  <div class="page-container">
    <h1>Arkiver lotteri</h1>

    <h2>Registrer lodd kjøpt</h2>

    <div class="colors">
      <div v-for="color in lotteryColors" :class="color.key + ' colors-box'" :key="color">
        <div class="colors-overlay">
          <p>{{ color.name }} kjøpt</p>
          <input v-model.number="color.value" min="0" :placeholder="0" type="number" />
        </div>
      </div>

      <div class="label-div">
        <label>Penger mottatt på vipps:</label>
        <input v-model.number="payed" placeholder="NOK" type="number" :step="price || 1" min="0" />
      </div>
    </div>

    <div v-if="wines.length > 0">
      <h2>Vinneres vin-valg</h2>

      <div class="winner-container">
        <wine v-for="wine in wines" :key="wine.id" :wine="wine">
          <div class="label-div">
            <label for="potential-winner-name">Virtuelle vinnere</label>
            <select id="potential-winner-name" type="text" placeholder="Navn" v-model="wine.winner">
              <option v-for="winner in winners" :value="winner">{{ winner.name }}</option>
            </select>
          </div>

          <div class="winner-element">
            <div class="color-selector">
              <div class="label-div">
                <label>Farge vunnet</label>
              </div>

              <button
                class="blue"
                :class="{ active: wine.winner.color == 'blue' }"
                @click="wine.winner.color = 'blue'"
              ></button>
              <button
                class="red"
                :class="{ active: wine.winner.color == 'red' }"
                @click="wine.winner.color = 'red'"
              ></button>
              <button
                class="green"
                :class="{ active: wine.winner.color == 'green' }"
                @click="wine.winner.color = 'green'"
              ></button>
              <button
                class="yellow"
                :class="{ active: wine.winner.color == 'yellow' }"
                @click="wine.winner.color = 'yellow'"
              ></button>
            </div>
            <div class="label-div">
              <label for="winner-name">Navn vinner</label>
              <input id="winner-name" type="text" placeholder="Navn" v-model="wine.winner.name" />
            </div>
          </div>
        </wine>
      </div>
    </div>

    <div v-if="wines.length > 0" class="button-container column">
      <button class="vin-button" @click="archiveLottery">Send inn og arkiver</button>
    </div>
  </div>
</template>

<script>
import { dateString } from "@/utils";
import Wine from "@/ui/Wine";

export default {
  components: { Wine },
  data() {
    return {
      payed: undefined,
      wines: [],
      winners: [],
      attendees: [],
      lotteryColors: [
        { value: 0, name: "Blå", key: "blue" },
        { value: 0, name: "Rød", key: "red" },
        { value: 0, name: "Grønn", key: "green" },
        { value: 0, name: "Gul", key: "yellow" }
      ],
      price: __PRICE__ || 10
    };
  },
  created() {
    this.fetchLotteryWines();
    this.fetchLotteryWinners();
    this.fetchLotteryAttendees();
  },
  watch: {
    lotteryColors: {
      deep: true,
      handler() {
        this.payed = this.getRaffleValue();
      }
    },
    payed(val) {
      this.$emit("counter", val);
    }
  },
  methods: {
    wineWithWinnerMapper(wine) {
      if (wine.winner == undefined) {
        wine.winner = {
          name: undefined,
          color: undefined
        };
      }
      return wine;
    },
    fetchLotteryWines() {
      return fetch("/api/lottery/wines")
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.wines = response.wines.map(this.wineWithWinnerMapper);
          } else {
            this.$toast.error({
              title: "Klarte ikke hente viner.",
              description: response.message
            });
          }
        });
    },
    fetchLotteryWinners() {
      return fetch("/api/lottery/winners")
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.winners = response.winners;
          } else {
            this.$toast.error({
              title: "Klarte ikke hente vinnere.",
              description: response.message
            });
          }
        });
    },
    fetchLotteryAttendees() {
      return fetch("/api/lottery/attendees")
        .then(resp => resp.json())
        .then(response => {
          if (response.success && response.attendees) {
            this.attendees = response.attendees;
            this.updateLotteryColorsWithAttendees(response.attendees)
          } else {
            this.$toast.error({
              title: "Klarte ikke hente deltakere.",
              description: response.message
            });
          }
        });
    },
    updateLotteryColorsWithAttendees(attendees) {
      this.attendees.map(attendee => {
        this.lotteryColors.map(color => (color.value += attendee[color.key]));
      });
    },
    getRaffleValue() {
      let rafflesBought = 0;
      this.lotteryColors.map(color => rafflesBought += Number(color.value));

      return rafflesBought * this.price;
    },
    archiveLottery: async function(event) {
      const validation = this.wines.every(wine => {
        if (wine.winner.name == undefined || wine.winner.name == "") {
          this.$toast.error({
            title: `Navn på vinner må defineres for vin: ${wine.name}`
          });
          return false;
        }
        if (wine.winner.color == undefined || wine.winner.color == "") {
          this.$toast.error({
            title: `Farge vunnet må defineres for vin: ${wine.name}`
          });
          return false;
        }

        return true;
      });

      if (validation == false) {
        return;
      }

      let rafflesPayload = {};
      this.lotteryColors.map(el => rafflesPayload.[el.key] = el.value);

      let stolen = 0;
      const payedDiff = this.payed - this.getRaffleValue()
      if (payedDiff) {
        stolen = payedDiff / this.price;
      }

      const payload = {
        wines: this.wines,
        raffles: rafflesPayload,
        stolen: stolen
      };

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lottery: payload
        })
      };

      return fetch("/api/lottery/archive", options)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.$toast.info({
              title: "Lotteriet er sendt inn og arkivert! Du kan nå slette viner, deltakere & vinnere slettes.",
              timeout: 10000
            });
          } else {
            this.$toast.error({
              title: "Noe gikk galt under innsending!",
              description: response.message
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
@import "@/styles/media-queries.scss";

select {
  margin: 0 0 auto;
  height: 2rem;
  min-width: 0;
  width: 98%;
  padding: 1%;
}

.button-container {
  margin-top: 1rem;
}

.page-container {
  padding: 0 1.5rem 3rem;

  @include desktop {
    max-width: 60vw;
    margin: 0 auto;
  }
}
.winner-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  > div {
    margin: 1rem;
    max-width: 350px;
  }

  .button-container {
    width: 100%;
  }
}

.winner-element {
  display: flex;
  flex-direction: column;

  > div {
    margin-bottom: 1rem;
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
