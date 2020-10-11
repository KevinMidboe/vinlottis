<template>
  <div class="container">
    <h1 class="title">Dagens viner</h1>
    <div class="wines-container">
      <Wine :wine="wine" v-for="wine in wines" :key="wine" />
    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import { prelottery } from "@/api";
import Banner from "@/ui/Banner";
import Wine from "@/ui/Wine";

export default {
  components: {
    Banner,
    Wine
  },
  data() {
    return {
      wines: []
    };
  },
  async mounted() {
    prelottery().then(wines => this.wines = wines);
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/variables";

.wine-image {
  height: 250px;
}

.wines-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}
</style>
