<template>
  <main>
    <h1>
      Alle foreslåtte viner
    </h1>
    <section class="requested-wines-container">
      <p v-if="wines == undefined || wines.length == 0">Ingen har foreslått noe enda!</p>
      <RequestedWineCard v-for="requestedEl in wines" :key="requestedEl.id" :requestedElement="requestedEl" @wineDeleted="filterOutDeletedWine" :showDeleteButton="isAdmin"/>
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

.requested-wines-container{
  display: grid;
  grid-gap: 1.5rem;
  justify-items: center;

  @media #{$mobileOnly}{
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    row-gap: 1.5rem;
    margin: 2rem;
  }

  @media #{$tabletOnly}{
    margin: 1em;
    grid: 1fr / 1fr 1fr;
    justify-items: center;
  }

  @media #{$desktopOnly}{
    margin: 1em;
    grid: 1fr / repeat(4, 1fr);
  }

  @media #{$widescreenAndUp}{
    width: 80%;
    margin: auto;
    grid: 1fr / repeat(5, 1fr);
    justify-items: center;
  }
}

h1{
  text-align: center;
}

</style>