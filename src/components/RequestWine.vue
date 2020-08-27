<template>
  <main>
    <h1>
      Anbefal en vin!
    </h1>
    <section>
      <input type="text" v-model="searchString" >
      <button @click=(fetchWineFromVin())>knapp</button>
      <div v-for="(wine, index) in this.wines" :key="index">
        <Wine :wine=wine >
          <button>Pick</button>
        </Wine>
      </div>
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

<style>

</style>