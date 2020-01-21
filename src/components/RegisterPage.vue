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
        <div class="label-div">
          <input type="text" v-model="winner.name" placeholder="Navn" />
        </div>
        <div class="label-div">
          <select v-model="winner.color">
            <option value="blue">Blå</option>
            <option value="red">Rød</option>
            <option value="green">Grønn</option>
            <option value="yellow">Gul</option>
          </select>
        </div>
        <div class="label-div">
          <input type="text" v-model="winner.wine.name" placeholder="Vin-navn" />
        </div>
        <div class="label-div">
          <input type="text" v-model="winner.wine.vivinoLink" placeholder="Vivino-link" />
        </div>
        <div class="label-div">
          <input type="text" v-model="winner.wine.rating" placeholder="Rating" />
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
      winners: []
    };
  },
  methods: {
    addWinner: function(event) {
      console.log("clicked");

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
      console.log(response);
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
h1 {
  width: 100vw;
  text-align: center;
}
div {
  font-size: 2rem;
}
input {
  font-size: 1.5rem;
  width: 100%;
}
.label-div {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding-bottom: 20px;
}
hr {
  width: 50vw;
}

.winner-container {
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.winner-element,
.color-container,
.button-container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

button {
  font-size: 1.5rem;
  width: 40%;
  margin: 10px;
}
</style>
