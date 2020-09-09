<template>
  <div class="requested-wine">
    <img
      v-if="wine.image"
      :src="wine.image"
      class="wine-image"
      :class="{ 'fullscreen': fullscreen }"
    />
    <img v-else class="wine-placeholder" alt="Wine image" />
    <h3 v-if="wine.name">{{ wine.name }}</h3>
    <h3 v-else>(no name)</h3>
    <p class="requested-amount">Foreslått: <strong>{{requestedElement.count}}</strong></p>

    <button class="vin-button" @click="request(wine)" v-if="!locallyRequested">Foreslå denne</button>
    <a
    v-if="wine.vivinoLink"
    :href="wine.vivinoLink"
    class="wine-link">
      Les mer
    </a>
    <button @click="deleteWine(wine)" v-if="showDeleteButton == true" class="vin-button danger">
      Slett vinen
    </button>
    </div>
</template>

<script>
import { deleteRequestedWine, requestNewWine } from "@/api";

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
    },
    showDeleteButton: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    request(wine){
      this.locallyRequested = true
      this.requestedElement.count = this.requestedElement.count +1
      requestNewWine(wine)
    },
    async deleteWine(wine) {
      if (window.confirm("Er du sikker på at du vil slette vinen?")) {
        let response = await deleteRequestedWine(wine);
        if (response['success'] == true) {
          this.$emit('wineDeleted', wine);
        } else {
          alert("Klarte ikke slette vinen");
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped> 
@import "../styles/requested-wine-card.scss";

</style>