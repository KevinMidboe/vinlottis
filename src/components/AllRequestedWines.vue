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
      [this.wines, this.isAdmin] = await allRequestedWines() || []
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>

<style lang="scss" scoped>
h1{
  text-align: center;
}

.requested-wines-container{
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap;
  align-items: stretch
}
</style>