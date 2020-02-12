<template>
  <div class="outer">
    <div class="container">
      <h1 class="title">Alle viner</h1>
      <div class="wines-container">
        <a :href="wine.vivinoLink" v-for="wine in wines">
          <Wine :wine="wine" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
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
    const _wines = await fetch("/api/wines/statistics/overall");
    this.wines = (await _wines.json()).sort((a, b) =>
      a.rating > b.rating ? -1 : 1
    );
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.wines-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 0 2rem;

  @media (min-width: 1500px) {
    max-width: 1000px;
    margin: 0 auto;
  }

  @include mobile {
    flex-direction: column;
  }
}
</style>
