<template>
  <div class="container">
    <div v-if="!posted">
      <h1 v-if="name">Gratulerer {{name}}!</h1>
      <p
        v-if="name"
      >Her er valgene for dagens lotteri, du har 10 minutter å velge etter du fikk SMS-en.</p>
      <h1 v-else-if="!turn && !existing" class="sent-container">Finner ikke noen vinner her..</h1>
      <h1 v-else-if="!turn" class="sent-container">Du må vente på tur..</h1>
      <div class="wines-container" v-if="name">
        <br />
        <br />
        <Wine
          :wine="wine"
          v-for="wine in wines"
          :key="wine"
          :winner="true"
          :fullscreen="true"
          :inlineSlot="true"
          v-on:chosen="chosenWine"
        />
      </div>
    </div>
    <div v-else-if="posted" class="sent-container">
      <h1>Valget ditt er sendt inn!</h1>
      <p>Du får mer info om henting snarest!</p>
    </div>
  </div>
</template>

<script>
import { getAmIWinner, postWineChosen, prelottery } from "@/api";
import Wine from "@/ui/Wine";
export default {
  components: { Wine },
  data() {
    return {
      id: null,
      existing: false,
      fetched: false,
      turn: false,
      name: null,
      wines: [],
      posted: false
    };
  },
  async mounted() {
    this.id = this.$router.currentRoute.params.id;

    let winnerObject = await getAmIWinner(this.id);
    this.fetched = true;
    if (!winnerObject || !winnerObject.existing) {
      console.error("non existing", winnerObject);
      return;
    }
    this.existing = true;
    if (winnerObject.existing && !winnerObject.turn) {
      console.error("not your turn yet", winnerObject);
      return;
    }
    this.turn = true;
    this.name = winnerObject.name;
    this.wines = await prelottery();
  },
  methods: {
    chosenWine: async function(name) {
      let posted = await postWineChosen(this.id, name);
      console.log("response", posted);
      if (posted.success) {
        this.posted = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/global";
.container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 2rem;
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

.wines-container {
  justify-content: center;
  display: flex;
  flex-direction: column;
}
</style>