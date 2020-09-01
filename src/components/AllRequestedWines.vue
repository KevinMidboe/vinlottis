<template>
  <main>
    <h1>
      Alle foreslåtte viner
    </h1>
    <section class="requested-wines-container">
      <p v-if="this.wines == undefined || this.wines.length <= 0">Ingen har foreslått noe enda!</p>
      <RequestedWineCard v-for="requestedEl in wines" :key="requestedEl.id" :requestedElement="requestedEl" @deletedOne="refreshData" />
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
      canRequest: true
    }
  },
  methods: {
    async refreshData(){
      const wines = await allRequestedWines()
      this.wines = wines
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