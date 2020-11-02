<template>
  <main class="container">
    <h1>Alle foreslåtte viner</h1>

    <section class="requested-wines-container">
      <p v-if="wines == undefined || wines.length == 0">Ingen har foreslått noe enda!</p>

      <RequestedWineCard v-for="requestedEl in wines" :key="requestedEl.wine._id" :requestedElement="requestedEl" @wineDeleted="filterOutDeletedWine" :showDeleteButton="isAdmin"/>
    </section>
  </main>
</template>

<script>
import { allRequestedWines } from "@/api";
import RequestedWineCard from "@/ui/RequestedWineCard";
export default {
  components: {
    RequestedWineCard
  },
  data(){
    return{
      wines: undefined,
      canRequest: true,
      isAdmin: false
    }
  },
  methods: {
    filterOutDeletedWine(wine){
      this.wines = this.wines.filter(item => item.wine._id !== wine._id)
    },
    async refreshData(){
      [this.wines, this.isAdmin] = await allRequestedWines() || [[], false]
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
@import "./src/styles/variables.scss";

.container {
  width: 90vw;
  margin: 3rem auto;
  margin-bottom: 0;
  padding-bottom: 3rem;
}

h1 {
  font-size: 3rem;
  font-family: "knowit";
  color: $matte-text-color;
  font-weight: normal;
}

.requested-wines-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}
</style>