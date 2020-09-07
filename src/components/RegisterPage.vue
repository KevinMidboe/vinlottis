<template>
  <div class="page-container">
    <h2 class="margin-top-md" id="addwine-title">Legg til vin i lotteri</h2>

    <ScanToVinmonopolet @wine="wineFromVinmonopoletScan" v-if="showCamera" />

    <div class="button-container">
      <button
        class="vin-button"
        @click="showCamera = !showCamera"
      >{{ showCamera ? "Skjul camera" : "Legg til vin med camera" }}</button>

      <button class="vin-button" @click="addEmptyWine">Legg til vin manuelt</button>
    </div>

    <section v-if="wines.length > 0" class="edit-wrapper">
      <wine v-for="wine in wines" :key="key" :wine="wine">
        <div class="edit-container">
          <div class="button-container row">
            <button
              class="vin-button"
              @click="editWine = amIBeingEdited(wine) ? false : wine"
            >{{ amIBeingEdited(wine) ? "Lukk" : "Rediger" }}</button>
            <button class="red vin-button" @click="deleteWine(wine)">Slett</button>
          </div>

          <div v-if="amIBeingEdited(wine)" class="edit-form">
            <div class="label-div" v-for="key in Object.keys(wine)" :key="key">
              <label>{{ key }}</label>
              <input type="text" v-model="wine[key]" :placeholder="key" />
            </div>
          </div>
        </div>
      </wine>
    </section>

    <div class="button-container" v-if="wines.length > 0">
      <button class="vin-button" @click="sendWines">Send inn viner</button>
    </div>

    <h2 class="margin-top-md">Send varsler</h2>
    <div class="margin-bottom-sm">
      <div class="label-div">
        <label for="notification">Push-melding</label>
        <textarea
          id="notification"
          type="text"
          rows="3"
          v-model="pushMessage"
          placeholder="Push meldingtekst"
        />
        <input id="notification-link" type="text" v-model="pushLink" placeholder="Push-click link" />
      </div>
    </div>
    <div class="button-container">
      <button class="vin-button" @click="sendPush">Send push</button>
    </div>

    <TextToast v-if="showToast" :text="toastText" v-on:closeToast="showToast = false" />
  </div>
</template>

<script>
import {
  prelottery,
  logWines,
  wineSchema
} from "@/api";
import TextToast from "@/ui/TextToast";
import Wine from "@/ui/Wine";
import ScanToVinmonopolet from "@/ui/ScanToVinmonopolet";

export default {
  components: { TextToast, Wine, ScanToVinmonopolet },
  data() {
    return {
      wines: [],
      pushMessage: "",
      pushLink: "/",
      toastText: undefined,
      showToast: false,
      showCamera: false,
      editWine: false
    };
  },
  created() {
    prelottery().then(wines => this.wines = wines)
  },
  methods: {
    amIBeingEdited(wine) {
      return this.editWine.id == wine.id && this.editWine.name == wine.name;
    },
    wineFromVinmonopoletScan(wineResponse) {
      const alreadyExists = this.wines.map(wine => wine.name).includes(wineResponse.name)

      if (alreadyExists) {
        this.toastText = "Vinen er allerede lagt til.";
        this.showToast = true;
        return;
      }

      this.toastText = "Fant og la til vin:<br>" + wineResponse.name;
      this.showToast = true;

      this.wines.unshift(wineResponse);
    },
    sendPush: async function() {
      let _response = await fetch("/subscription/send-notification", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          message: this.pushMessage,
          link: this.pushLink
        })
      });

      let response = await _response.json();
      if (response) {
        alert("Sendt!");
      } else {
        alert("Noe gikk galt!");
      }
    },
    addEmptyWine: async function(event) {
      const wine = await wineSchema();

      this.editWine = wine;
      this.wines.unshift(wine);
    },
    deleteWine(deletedWine) {
      this.wines = this.wines.filter(wine => wine.name != deletedWine.name);
    },
    sendWines: async function() {
      let response = await logWines(this.wines);
      if (response.success == true) {
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

.page-container {
  padding: 0 1.5rem 3rem;

  @include desktop {
    max-width: 60vw;
    margin: 0 auto;
  }
}

.edit-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.edit-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-form {
  width: 100%;
  margin-top: 1.5rem;

  label {
    margin-top: 0.75rem;
    margin-bottom: 0;
  }
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
</style>
