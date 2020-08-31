<template>
  <main>
    <h1>
      Alle viner
    </h1>
    <section>
      {{this.wines}}
    </section>
  </main>
</template>

<script>
import { allRequestedWines } from "@/api";

export default {
  data(){
    return{
      wines: undefined
    }
  },
  async mounted() {
    const wines = await allRequestedWines();
    this.wines = wines  
  }
}
</script>

<style>

</style>