<template>
  <section class="main-container">
    <Modal
      v-if="showModal"
      modalText="Ønsket ditt har blitt lagt til"
      :buttons="modalButtons"
      @click="emitFromModalButton"
    ></Modal>
    <h1>
      Foreslå en vin!
    </h1>

    <section class="search-container">
      <section class="search-section">
        <input
          type="text"
          v-model="searchString"
          @keyup.enter="searchWines()"
          placeholder="Søk etter en vin du liker her!🍷"
          class="search-input-field"
        />
        <button :disabled="!searchString" @click="searchWines()" class="vin-button">Søk</button>
      </section>

      <section v-for="(wine, index) in wines" :key="index" class="single-result">
        <img v-if="wine.image" :src="wine.image" class="wine-image" :class="{ fullscreen: fullscreen }" />
        <img v-else class="wine-placeholder" alt="Wine image" />
        <section class="wine-info">
          <h2 v-if="wine.name">{{ wine.name }}</h2>
          <h2 v-else>(no name)</h2>
          <div class="details">
            <span v-if="wine.rating">{{ wine.rating }}%</span>
            <span v-if="wine.price">{{ wine.price }} NOK</span>
            <span v-if="wine.country">{{ wine.country }}</span>
            <span v-if="wine.year && wine.year !== '0000'">{{ wine.year }}</span>
          </div>
        </section>
        <button class="vin-button" @click="requestWine(wine)">Foreslå denne</button>
        <a v-if="wine.vivinoLink" :href="wine.vivinoLink" class="wine-link">Les mer</a>
      </section>
      <p v-if="loading == false && wines && wines.length == 0">
        Fant ingen viner med det navnet!
      </p>
      <p v-else-if="loading">Loading...</p>
    </section>
  </section>
</template>

<script>
import { searchForWine } from "@/api";
import Wine from "@/ui/Wine";
import Modal from "@/ui/Modal";
import RequestedWineCard from "@/ui/RequestedWineCard";

export default {
  components: {
    Wine,
    Modal,
    RequestedWineCard
  },
  data() {
    return {
      searchString: undefined,
      wines: undefined,
      showModal: false,
      loading: false,
      modalButtons: [
        {
          text: "Legg til flere viner",
          action: "stay"
        },
        {
          text: "Se alle viner",
          action: "move"
        }
      ]
    };
  },
  methods: {
    fetchWinesByQuery(query) {
      let url = new URL("/api/vinmonopolet/wine/search", window.location);
      url.searchParams.set("name", query);

      this.wines = [];
      this.loading = true;

      return fetch(url.href)
        .then(resp => resp.json())
        .then(response => (this.wines = response.wines))
        .finally(wines => (this.loading = false));
    },
    searchWines() {
      if (this.searchString) {
        let localSearchString = this.searchString.replace(/ /g, "_");
        this.fetchWinesByQuery(localSearchString);
      }
    },
    requestWine(wine) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wine: wine })
      };

      return fetch("/api/request", options)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.showModal = true;
            this.$toast.info({
              title: `Vinen ${wine.name} har blitt foreslått!`
            });
          } else {
            this.$toast.error({
              title: "Obs, her oppsto det en feil! Feilen er logget.",
              description: response.message
            });
          }
        });
    },
    emitFromModalButton(action) {
      if (action == "stay") {
        this.showModal = false;
      } else {
        this.$router.push("/requested-wines");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries";
@import "@/styles/global";
@import "@/styles/variables";

h1 {
  text-align: center;
}

.main-container {
  margin: auto;
  max-width: 1200px;
}

input[type="text"] {
  width: 90%;
  color: black;
  border-radius: 4px;
  padding: 1rem 1rem;
  border: 1px solid black;
  max-width: 90%;
}

.search-container {
  margin: 1rem;
}

.search-section {
  display: grid;
  grid: 1fr / 1fr 0.2fr;

  @include mobile {
    .vin-button {
      display: none;
    }
    .search-input-field {
      grid-column: 1 / -1;
    }
  }
}

.single-result {
  margin-top: 1rem;
  display: grid;
  grid: 1fr / 0.5fr 2fr 0.5fr 0.5fr;
  grid-template-areas: "picture details button-left button-right";
  justify-items: center;
  align-items: center;
  grid-gap: 1em;
  padding-bottom: 1em;
  margin-bottom: 1em;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.2);

  @include mobile {
    grid: 1fr 0.5fr / 0.5fr 1fr;
    grid-template-areas:
      "picture details"
      "button-left button-right";
    grid-gap: 0.5em;

    .vin-button {
      grid-area: button-right;
      padding: 0.5em;
      font-size: 1em;
      line-height: 1em;
      height: 2em;
    }

    .wine-link {
      grid-area: button-left;
    }

    h2 {
      font-size: 1em;
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .wine-image {
    height: 100px;
    grid-area: picture;
  }

  .wine-placeholder {
    height: 100px;
    width: 70px;
    grid-area: picture;
  }

  .wine-info {
    grid-area: details;
    width: 100%;

    h2 {
      margin: 0;
    }
    .details {
      top: 0;
      display: flex;
      flex-direction: column;
    }
  }
  .wine-link {
    grid-area: button-left;
    color: #333333;
    font-family: Arial;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px solid $link-color;
    height: 1.2em;
    width: max-content;
  }

  .vin-button {
    grid-area: button-right;
  }

  @include tablet {
    h2 {
      font-size: 1.2em;
    }
  }

  @include desktop {
    h2 {
      font-size: 1.6em;
    }
  }
}
</style>
