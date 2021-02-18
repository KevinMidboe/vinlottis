<template>
  <div>
    <div v-if="!posted" class="container">
      <h1 v-if="name">Gratulerer {{ name }}!</h1>

      <p v-if="name">
        Her er valgene for dagens lotteri, du har 10 minutter å velge etter du fikk SMS-en.
      </p>

      <h1 v-else-if="!turn && wines.length" class="sent-container">Finner ikke noen vinner her..</h1>

      <h1 v-else-if="!turn" class="sent-container">Du må vente på tur..</h1>

      <div class="wines-container" v-if="name">
        <Wine :wine="wine" v-for="wine in wines" :key="wine">
          <button @click="chooseWine(wine)" class="vin-button select-wine">Velg denne vinnen</button>
        </Wine>
      </div>
    </div>

    <div v-else-if="posted" class="sent-container">
      <h1>Valget ditt er sendt inn!</h1>
      <p>Du får mer info om henting snarest!</p>
    </div>
  </div>
</template>

<script>
import Wine from "@/ui/Wine";

export default {
  components: { Wine },
  data() {
    return {
      id: null,
      turn: false,
      name: null,
      wines: [],
      posted: false
    };
  },
  async mounted() {
    const { id } = this.$router.currentRoute.params;

    this.id = id;
    this.getPrizes(id);
  },
  methods: {
    getPrizes(id) {
      fetch(`/api/lottery/prize-distribution/prizes/${id}`)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.wines = response.wines;
            this.name = response.winner.name;
            this.turn = true;
          }
        });
    },
    chooseWine(wine) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wine })
      };

      fetch(`/api/lottery/prize-distribution/prize/${this.id}`, options)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.$toast.info({ title: `Valgt vin: ${wine.name}` });
            this.posted = true;
          } else {
            this.$toast.error({
              title: "Klarte ikke velge vin :(",
              description: response.message
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
  padding: 2rem;
  width: 80%;
  margin: 0 auto;
  max-width: 2000px;
}

.wines-container {
  width: 100%;
}

.sent-container {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.select-wine {
  margin-top: 1rem;
}
</style>
