<template>
  <main>
    <h1>
      Foreslå en vin!
    </h1>
    <section>
      <input type="text" v-model="searchString" >
      <button @click=(fetchWineFromVin()) class="vin-button">Søk</button>
      <section v-for="(wine, index) in this.wines" :key="index" class="search-results-container">
        <img
          v-if="wine.image"
          :src="wine.image"
          class="wine-image"
          :class="{ 'fullscreen': fullscreen }"
        />
        <img v-else class="wine-placeholder" alt="Wine image" />
        <section class="wine-info">
          <h2 v-if="wine.name">{{ wine.name }}</h2>
          <h2 v-else>(no name)</h2>
          <span v-if="wine.price">{{ wine.price }} NOK</span>
          <span v-if="wine.country">{{ wine.country }}</span>
        </section>
        <section class="buttons">
          <button class="vin-button">Send inn denne som ønske</button>
          <button class="vin-button">Les mer på polet</button>
        </section>
      </section>
    </section>
  </main>
</template>

<script>
import { searchForWine } from "@/api";
import Wine from "@/ui/Wine";

export default {
  components: {
    Wine
  },
  data() {
    return {
      searchString: undefined,
      res: undefined,
      wines: undefined,
    }
  },
  methods: {
    fetchWineFromVin(){
      searchForWine(this.searchString)
        .then(res => this.wines = res)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/global";
@import "./src/styles/variables";

main{
  margin: auto;
  width: 80%;
}

input[type="text"] {
  width: 100%;
  color: black;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  border: 1px solid black;
  max-width: 200px;
}

.search-results-container{
  display: flex;
  border: 1px solid black;

  .buttons{
    margin-left: auto;
    order: 2;
  }
}

.wine-image {
  height: 100px;
}

.wine-placeholder {
  height: 100px;
  width: 70px;
}

.wine-info{
  display: flex;
  flex-direction: column;
}


</style>