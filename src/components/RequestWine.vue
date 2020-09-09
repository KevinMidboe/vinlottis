<template>
  <main>
    <h1>
      Foreslå en vin!
    </h1>
    <Modal 
      v-if="showModal" 
      modalText="Ønsket ditt har blitt lagt til" 
      :buttons="modalButtons"
      @click="emitFromModalButton"
    ></Modal>
    <section>
      <section class="search-section">
        <input type="text" v-model="searchString" @keyup.enter="fetchWineFromVin()" placeholder="Søk etter en vin du liker her!🍷">
        <button :disabled="!searchString" @click="fetchWineFromVin()" class="vin-button">Søk</button>
      </section>
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
          <div class="__details">
            <span v-if="wine.rating">{{ wine.rating }}%</span>
            <span v-if="wine.price">{{ wine.price }} NOK</span>
            <span v-if="wine.country">{{ wine.country }}</span>
          </div>
        </section>
        <section class="buttons">
          <button class="vin-button" @click="request(wine)">Foreslå denne</button>
          <a
          v-if="wine.vivinoLink"
          :href="wine.vivinoLink"
          class="wine-link"
        >Les mer på polet</a>
        </section>
      </section>
      <p v-if="this.wines && this.wines.length == 0">
        Fant ingen viner med det navnet!
      </p>
    </section>
  </main>
</template>

<script>
import { searchForWine, requestNewWine } from "@/api";
import Wine from "@/ui/Wine";
import Modal from "@/ui/Modal";

export default {
  components: {
    Wine,
    Modal
  },
  data() {
    return {
      searchString: undefined,
      wines: undefined,
      showModal: false,
      modalButtons: [
        {
          text: "Legg til flere viner",
          action: "stay"
        },
        {
          text: "Se alle viner",
          action: "move"
        }
      ]
    }
  },
  methods: {
    fetchWineFromVin(){
      if(this.searchString){
        this.wines = []
        let localSearchString = this.searchString.replace(/ /g,"_");
        searchForWine(localSearchString)
          .then(res => this.wines = res)
      }
    },
    request(wine){
      requestNewWine(wine)
        .then(() => this.showModal = true)
    },
    emitFromModalButton(action){
      if(action == "stay"){
        this.showModal = false
      } else {
        this.$router.push("/requested-wines");
      }
    }
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
  text-align: center;
  z-index: 0;
}

input[type="text"] {
  width: 100%;
  color: black;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  border: 1px solid black;
  max-width: 80%;
}

.search-section{
  display: flex;
  justify-content: space-around;
  flex-flow: row;
}

.search-results-container{
  display: flex;
  padding: 3px;
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.3);   
  margin: 1rem 0;
  justify-content: space-around;
  flex-flow: row wrap;
  align-items: stretch;


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
    .__details{
      display: flex;
      flex-direction: column;
    }
  }
  .wine-link {
    color: #333333;
    font-family: Arial;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px solid $link-color;
    width: fit-content;
  }

  .buttons{
    display: flex;
    align-items: center;
    order: 2;
    justify-content: space-between;
    width: 40%;
    margin-right: 1rem;
  }
  @include mobile {
    display: flex;
    flex-direction: column;
    .wine-image {
      height: 100px;
      width: 50px;
      align-self: center;
    }
    .buttons{
      display: flex;
      flex-direction: column;
      align-self: center;
      margin: 1em;
      .wine-link{
        margin-top: 1em;
      }
    }
    
  }
}


</style>