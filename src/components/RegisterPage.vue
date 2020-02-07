<template>
  <div>
    <h1>Registrering</h1>
    <div class="color-container">
      <div class="label-div">
        <label for="blue">Blå</label>
        <input id="blue" type="number" v-model="blue" />
      </div>
      <div class="label-div">
        <label for="red">Rød</label>
        <input id="red" type="number" v-model="red" />
      </div>
      <div class="label-div">
        <label for="green">Grønn</label>
        <input id="green" type="number" v-model="green" />
      </div>
      <div class="label-div">
        <label for="yellow">Gul</label>
        <input id="yellow" type="number" v-model="yellow" />
      </div>
    </div>
    <div class="button-container">
      <button @click="addWinner">Legg til en vinner</button>
      <button @click="sendInfo">Send inn</button>
    </div>
    <div class="winner-container" v-if="winners.length > 0">
      Vinnere
      <div v-for="winner in winners" class="winner-element">
        <hr />
        <div class="winnner-container-inner">
          <div class="input-container">
            <div class="label-div">
              <input type="text" v-model="winner.name" placeholder="Navn" />
            </div>
            <div class="label-div">
              <div class="color-selector">
                <button class="blue"
                        :class="{'active': winner.color == 'blue' }"
                        @click="updateColorForWinner(winner, 'blue')"></button>
                <button class="red"
                        :class="{'active': winner.color == 'red' }"
                        @click="updateColorForWinner(winner, 'red')"></button>
                <button class="green"
                        :class="{'active': winner.color == 'green' }"
                        @click="updateColorForWinner(winner, 'green')"></button>
                <button class="yellow"
                        :class="{'active': winner.color == 'yellow' }"
                        @click="updateColorForWinner(winner, 'yellow')"></button>
              </div>

              <span class="color-selected">Selected color: {{ winner.color ? winner.color : '(none)' }}</span>
            </div>
            <div class="label-div">
              <input
                type="text"
                v-model="winner.wine.name"
                placeholder="Vin-navn"
              />
            </div>
            <div class="label-div">
              <input
                type="text"
                v-model="winner.wine.vivinoLink"
                placeholder="Vivino-link"
              />
            </div>
            <div class="label-div">
              <input
                type="text"
                v-model="winner.wine.rating"
                placeholder="Rating"
              />
            </div>
          </div>
          <div class="wine-image">
            <img :src="winner.wine.image" />
          </div>
        </div>
        <hr />
      </div>
    </div>
    <div class="button-container">
      <button @click="addWine">Legg til en vin</button>
      <button @click="sendWines">Send inn viner</button>
    </div>
    <div class="wines-container" v-if="wines.length > 0">
      Viner
      <div v-for="wine in wines" class="wine-element">
        <hr />
        <div class="label-div">
          <input type="text" v-model="wine.name" placeholder="Vin-navn" />
        </div>
        <div class="label-div">
          <input
            type="text"
            v-model="wine.vivinoLink"
            placeholder="Vivino-link"
          />
        </div>
        <div class="label-div">
          <input type="text" v-model="wine.id" placeholder="Id" />
        </div>
        <div class="label-div">
          <input type="text" v-model="wine.image" placeholder="Bilde" />
        </div>
        <div class="label-div">
          <input type="text" v-model="wine.rating" placeholder="Rating" />
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      winners: [],
      wines: []
    };
  },
  async mounted() {
    const _wines = await fetch("/api/wines/prelottery");
    const wines = await _wines.json();
    for (let i = 0; i < wines.length; i++) {
      let wine = wines[i];
      this.winners.push({
        name: "",
        color: "",
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
  methods: {
    addWine: function(event) {
      this.wines.push({
        name: "",
        vivinoLink: "",
        rating: "",
        id: "",
        image: ""
      });
    },
    updateColorForWinner(winner, color) {
      console.log('winner', winner)
      console.log('color', color)

      winner.color = color
    },
    sendWines: async function() {
      let _response = await fetch("/api/log/wines", {
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: JSON.stringify(this.wines)
      });
      let response = await _response.json();
      if (response == true) {
        alert("Sendt!");
        window.location.reload();
      } else {
        alert("Noe gikk galt under innsending");
      }
    },
    addWinner: function(event) {
      this.winners.push({
        name: "",
        color: "",
        wine: {
          name: "",
          vivinoLink: "",
          rating: ""
        }
      });
    },
    sendInfo: async function(event) {
      let sendObject = {
        purchase: {
          date: new Date(),
          blue: this.blue,
          red: this.red,
          yellow: this.yellow,
          green: this.green
        },
        winners: this.winners
      };

      if (sendObject.purchase.red == undefined) {
        alert("Rød må defineres");
        return;
      }
      if (sendObject.purchase.green == undefined) {
        alert("Grønn må defineres");
        return;
      }
      if (sendObject.purchase.yellow == undefined) {
        alert("Gul må defineres");
        return;
      }
      if (sendObject.purchase.blue == undefined) {
        alert("Blå må defineres");
        return;
      }

      if (sendObject.winners.length == 0) {
        alert("Det må være med vinnere");
        return;
      }
      for (let i = 0; i < sendObject.winners.length; i++) {
        let currentWinner = sendObject.winners[i];

        if (currentWinner.name == undefined || currentWinner.name == "") {
          alert("Navn må defineres");
          return;
        }
        if (currentWinner.color == undefined || currentWinner.color == "") {
          alert("Farge må defineres");
          return;
        }
      }

      let _response = await fetch("/api/log/", {
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: JSON.stringify(sendObject)
      });
      let response = await _response.json();
      if (response == true) {
        alert("Sendt!");
        window.location.reload();
      } else {
        alert("Noe gikk galt under innsending");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";
h1 {
  width: 100vw;
  text-align: center;
  font-family: knowit, Arial;
}
div {
  font-size: 2rem;
  font-family: Arial;
}
input {
  font-size: 1.5rem;
  width: 100%;
}
hr {
  width: 50vw;
}

.winner-container,
.wine-container,
.wines-container {
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;

  @include mobile {
    width: 80%;
  }
}

.winner-element,
.wine-element,
.color-container,
.button-container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  button {
    cursor: pointer;
  }
}

.color-container {
  width: 50%;
  margin: auto;
}

.wines-container {
  text-align: center;
}

.label-div {
  display: flex;
  width: 50%;
  flex-direction: column;
  padding-bottom: 20px;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @include mobile {
    margin-top: 1.2rem;
  }
}

.color-selector {
  .active {
    border: 2px solid black;
  }

  button {
    border: 2px solid transparent;
    color: #333;
    padding: 10px 30px;
    margin: 0;
    font-size: 1.3rem;
    height: calc(3rem + 18px);
    display: inline-flex;
    flex-wrap: wrap;
    flex-direction: row;
    max-height: calc(3rem + 18px);
    max-width: calc(3rem + 18px);
    margin: 10px;
    // disable-dbl-tap-zoom
    touch-action: manipulation;

    &.green {
      background: #c8f9df;
    }&.blue {
      background: #d4f2fe;
    }&.red {
      background: #fbd7de;
    }&.yellow {
      background: #fff6d6;
    }
  }
}

.color-selected {
  @include mobile {
    display: block;
    width: 100%;
    font-size: 1.5rem !important;
  }
}

.label-div label {
  padding: 0 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-size: 1.22rem;
}

.input-container {
  @include mobile {
    width: 100%;
  }

  & .label-div {
    width: 100%;
  }
}

.winnner-container-inner {
  display: flex;

  @include mobile {
    flex-direction: column;
  }
}

.wine-image {
  padding-left: 30px;

  & img {
    height: 400px;
  }
}

input,
button {
  font-size: 1.5rem;
}

select {
  width: 100%;
  font-size: 1.5rem;
}

input {
  font-size: 1.5rem;
  padding: 8px;
  margin: 0;
  height: 3rem;
  max-height: 3rem;
  border: 1px solid rgba(#333333, 0.3);
}

button {
  border: none;
  background: #b7debd;
  color: #333;
  padding: 10px 30px;
  margin: 0;
  width: fit-content;
  font-size: 1.3rem;
  display: block;
  height: calc(3rem + 18px);
  display: inline-flex;
  max-height: calc(3rem + 18px);
  width: 400px;
  margin: 10px;
  // disable-dbl-tap-zoom
  touch-action: manipulation;
}
</style>
