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
@import "../styles/global.scss";

.requested-wine{
  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.65);
  text-align: center;
  display: grid;
  grid: auto-flow min-content / 2fr 1fr;
  grid-template-areas: "top top"
                       "middle-left middle-right1"
                       "middle-left middle-right2"
                       "bottom1 bottom1"
                       "bottom2 bottom2";
  grid-gap: 1em;
  justify-items: center;
  align-items: center;
  width: 100%;
  
  h3{
    grid-area: top;
    word-break: keep-all;
    width: 90%;
  }

  img{
    height: 13em;
    grid-area: middle-left;
  }

  .requested-amount{
    grid-area: middle-right1;
    width: 90%;
    word-break: keep-all;
  }
  
  .wine-link{
    grid-area: middle-right2;
    color: #333333;
    font-family: Arial;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px solid $link-color;
    height: 1em;
  }

  .vin-button{
    grid-area: bottom1;
    margin-bottom: 1em;

    &.danger{
      grid-area: bottom2;
      background-color: $light-red;
      color: $red;
    }
  }
}

</style>