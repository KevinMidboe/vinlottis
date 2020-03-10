<template>
  <div class="page-container">
    <h1>Registrering</h1>
    <div class="notification-element">
      <div class="label-div">
        <label for="notification">Push-melding</label>
        <textarea id="notification" type="text" rows="3" v-model="pushMessage" placeholder="Push meldingtekst" />
      </div>
    </div>
    <div class="button-container">
      <button class="vin-button" @click="sendPush">Send push</button>
    </div>

    <hr />

    <h2 id="addwine-title">Prelottery</h2>
    
    <ScanToVinmonopolet @wine="wineFromVinmonopoletScan" v-if="showCamera"/>

    <div class="button-container">
      <button class="vin-button" @click="showCamera = !showCamera">
        {{ showCamera ? "Skjul camera" : "Legg til vin med camera" }}
      </button>
      
      <button class="vin-button" @click="addWine">Legg til en vin manuelt</button>
    </div>

    <div v-if="wines.length > 0">
      <wine v-for="wine in wines" :wine="wine">
        <div class="button-container row">
          <button class="vin-button" @click="editWine = amIBeingEdited(wine) ? false : wine">
            {{ amIBeingEdited(wine) ? "Lukk" : "Rediger" }}
          </button>
          <button class="red vin-button" @click="deleteWine(wine)">Slett</button>
        </div>

        <div v-if="amIBeingEdited(wine)" class="wine-edit">
          <div class="label-div" v-for="key in Object.keys(wine)">
            <label>{{ key }}</label>
            <input type="text" v-model="wine[key]" :placeholder="key" />
          </div>
        </div>
      </wine>
    </div>
    <div class="button-container" v-if="wines.length > 0">  
      <button class="vin-button" @click="sendWines">Send inn viner</button>
    </div>

    <hr />

    <h2>Lottery</h2>

    <h3>Legg til lodd kjøpt</h3>
    <div class="colors">
      <div v-for="color in lotteryColorBoxes" :class="color.css + ' colors-box'">
       <div class="colors-overlay">
          <p>{{ color.name }} kjøpt</p>
          <input v-model="color.value"
                 min="0"
                 :placeholder="0"
                 type="number" />
        </div>
      </div>

      <div class="label-div">
        <label>Totalt kjøpt for:</label>
        <input v-model="payed" placeholder="NOK" type="number" :step="price || 1" min="0" />
      </div>
    </div>

    <h3>Vinnere</h3>
    <div class="winner-container" v-if="winners.length > 0">
      <wine v-for="winner in winners" :wine="winner.wine">
        <div class="winner-element">
          <div class="color-selector">
            <div class="label-div">
              <label>Farge vunnet</label>
            </div>
            <button
              class="blue"
              :class="{'active': winner.color == 'blue' }"
              @click="winner.color = 'blue'"
            ></button>
            <button
              class="red"
              :class="{'active': winner.color == 'red' }"
              @click="winner.color = 'red'"
            ></button>
            <button
              class="green"
              :class="{'active': winner.color == 'green' }"
              @click="winner.color = 'green'"
            ></button>
            <button
              class="yellow"
              :class="{'active': winner.color == 'yellow' }"
              @click="winner.color = 'yellow'"
            ></button>
          </div>

          <div class="label-div">
            <label for="winner-name">Navn vinner</label>
            <input id="winner-name" type="text" placeholder="Navn" v-model="winner.name"/>
          </div>
        </div>
      </wine>

      <div class="button-container">
        <button class="vin-button" @click="sendInfo">Send inn vinnere</button>
        <button class="vin-button" @click="resetWinnerDataInStorage">Reset local wines</button>
      </div>
    </div>

  <TextToast v-if="showToast"
             :text="toastText"
             v-on:closeToast="showToast = false" />
  </div>
</template>

<script>
  import { prelottery, log, logWines, wineSchema } from "@/api";
  import TextToast from "@/ui/TextToast";
  import Wine from "@/ui/Wine";
  import ScanToVinmonopolet from "@/ui/ScanToVinmonopolet";

  export default {
    components: { TextToast, Wine, ScanToVinmonopolet },
    data() {
      return {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0,
        payed: undefined,
        winners: [],
        wines: [],
        pushMessage: "",
        toastText: undefined,
        showToast: false,
        showCamera: false,
        editWine: false,
        price: __PRICE__
      };
    },
    created() {
      this.fetchAndAddPrelotteryWines()
        .then(this.getWinnerdataFromStorage)

      window.addEventListener("unload", this.setWinnerdataToStorage);
    },
    beforeDestroy() {
      this.setWinnerdataToStorage()
    },
    computed: {
      lotteryColorBoxes() {
        return [{ value: this.blue, name: "Blå", css: "blue" },
        { value: this.red, name: "Rød", css: "red" },
        { value: this.green, name: "Grønn", css: "green" },
        { value: this.yellow, name: "Gul", css: "yellow" }]
      }
    },
    methods: {
      amIBeingEdited(wine) {
        return this.editWine.id == wine.id && this.editWine.name == wine.name;
      },
      async fetchAndAddPrelotteryWines() {
        const wines = await prelottery()

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
      wineFromVinmonopoletScan(wineResponse) {
        if (this.wines.map(wine => wine.name).includes(wineResponse.name)) {
          this.toastText = "Vinen er allerede lagt til."
          this.showToast = true
          return
        }

        this.toastText = "Fant og la til vin:<br>" + wineResponse.name 
        this.showToast = true;

        this.wines.unshift(wineResponse)
      },
      sendPush: async function() {
        let _response = await fetch("/subscription/send-notification", {
          headers: {
            "Content-Type": "application/json"
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: "POST",
          body: JSON.stringify({ message: this.pushMessage })
        });
        let response = await _response.json();
        if (response) {
          alert("Sendt!");
        } else {
          alert("Noe gikk galt!");
        }
      },
      addWine: async function(event) {
        const wine = await wineSchema()

        this.editWine = wine;
        this.wines.unshift(wine);
      },
      deleteWine(deletedWine) {
        this.wines = this.wines.filter(wine => wine.name != deletedWine.name)
      },
      sendWines: async function() {
        let response = await logWines(this.wines)
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

        sendObject.purchase.bought =
          parseInt(this.blue) +
          parseInt(this.red) +
          parseInt(this.green) +
          parseInt(this.yellow);
        const stolen = sendObject.purchase.bought - parseInt(this.payed) / 10;
        if (isNaN(stolen) || stolen == undefined) {
          alert("Betalt må registreres");
          return;
        }
        sendObject.purchase.stolen = stolen;

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

        let response = await log(sendObject)
        if (response == true) {
          alert("Sendt!");
          window.location.reload();
        } else {
          alert(response.message || "Noe gikk galt under innsending");
        }
      },
      getWinnerdataFromStorage() {
        if (this.winners.length == 0) {
          return
        }
        
        let localWinners = localStorage.getItem("winners");
        if (localWinners) {
          localWinners = JSON.parse(localWinners);

          this.winners = this.winners.map(winner => {
            const localWinnerMatch = localWinners.filter(localWinner => localWinner.wine.name == winner.wine.name || localWinner.wine.id == winner.wine.id)

            if (localWinnerMatch.length > 0) {
              winner.name = localWinnerMatch[0].name || winner.name
              winner.color = localWinnerMatch[0].color || winner.name
            }
      
            return winner
          })
        }

        let localColors = localStorage.getItem("colorValues");
        if (localColors) {
          localColors = localColors.split(",")
          this.lotteryColorBoxes.forEach((color, i) => {
            color.value = Number(localColors[i]) || null
          })
        }
      },
      setWinnerdataToStorage() {
        console.log("saving localstorage")
        localStorage.setItem("winners", JSON.stringify(this.winners))
        localStorage.setItem("colorValues", this.lotteryColorBoxes.map(color => color.value || null))
        window.removeEventListener("unload", this.setWinnerdataToStorage)
      },
      resetWinnerDataInStorage() {
        localStorage.removeItem("winners")
        localStorage.removeItem("colorValues")
        this.winners = []
        this.fetchAndAddPrelotteryWines()
          .then(resp => this.winners = resp)
        this.lotteryColorBoxes.map(color => color.value = null)
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

h1 {
  width: 100%;
  text-align: center;
  font-family: knowit, Arial;
}

h2 {
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  font-family: knowit, Arial
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

.notification-element {
  margin-bottom: 2rem;
}
.winner-element {
  display: flex;
  flex-direction: row;
}
.wine-element {
  align-items: flex-start;
}

.wine-edit {
  margin-top: 1.5rem;

  label {
    margin-top: 0.75rem;
    margin-bottom: 0;
  }
}

.color-selector {
  margin-bottom: 0.65rem;
  margin-right: 1rem;

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
  margin: 3rem auto 0;

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
    top: .4rem;
    left: .5rem;
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

.green, .green .colors-overlay > input {
  background-color: $light-green;
  color: $green;
}

.blue, .blue .colors-overlay > input {
  background-color: $light-blue;
  color: $blue;
}

.yellow, .yellow .colors-overlay > input {
  background-color: $light-yellow;
  color: $yellow;
}

.red, .red .colors-overlay > input {
  background-color: $light-red;
  color: $red;
}
</style>
