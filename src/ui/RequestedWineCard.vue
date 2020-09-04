<template>
  <div class="requested-wine">
    <img
      v-if="wine.image"
      :src="wine.image"
      class="wine-image"
      :class="{ 'fullscreen': fullscreen }"
    />
    <img v-else class="wine-placeholder" alt="Wine image" />
    <section class="wine-info">
      <h3 v-if="wine.name">{{ wine.name }}</h3>
      <h3 v-else>(no name)</h3>
      <p>Antall ganger denne har blitt foreslått: {{requestedElement.count}}</p>
      <section class="buttons">
          <button class="vin-button" @click="request(wine)" v-if="!locallyRequested">Foreslå denne</button>
          <a
          v-if="wine.vivinoLink"
          :href="wine.vivinoLink"
          class="wine-link"
        >Les mer på polet</a>
        </section>
        <!-- <button @click="deleteWine(wine)">
          Slett vinen
        </button> -->
      </section>
    </div>
</template>

<script>
import { deleteRequestedWine } from "@/api";

export default {
  data(){
    return {
      wine: this.requestedElement.wine,
      locallyRequested: false
    }
  },
  props: {
    requestedElement: {
      required: true,
      type: Object
    }
  },
  methods: {
    request(wine){
      this.locallyRequested = true
      this.requestedElement.count = this.requestedElement.count +1
      const options = {
        body: JSON.stringify({
          wine: wine
        }),
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post"
      }
      fetch("http://localhost:30030/api/request", options)
        .then(res => res.json())
    },
    async deleteWine(wine) {
      if (window.confirm("Er du sikker på at du vil slette vinen?")) {
        let response = await deleteRequestedWine(wine);
        if (response) {
          this.$emit('deletedOne');
        } else {
          alert("Klarte ikke hente ut vinnere");
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped> 

.requested-wine{
  padding: 20px;
  border-radius: 1px;
  margin: 1rem 0;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
}
</style>