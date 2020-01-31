<template>
  <div class="outer">
    <div class="container">
      <h1 class="title">Dagens viner</h1>
      <div class="wines-container">
        <a :href="wine.vivinoLink" v-for="wine in wines">
          <div class="inner-wine-container">
            <div class="left">
              <img :src="wine.image" class="wine-image" />
            </div>
            <div class="right">
              <h3>{{ wine.name }}</h3>
              <spam>{{ wine.rating }} rating</spam>
              <spam class="wine-link">Les mer</spam>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import Banner from "@/ui/Banner";

export default {
  components: {
    Banner
  },
  data() {
    return {
      wines: []
    };
  },
  async mounted() {
    const _wines = await fetch("/api/wines/prelottery");
    this.wines = await _wines.json();
  }
};
</script>

<style lang="scss" scoped>
.wine-image {
  height: 250px;
}

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.inner-wine-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  width: 500px;
  font-family: Arial;
  margin-bottom: 30px;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 150px;
  margin-left: 50px;
}

a,
a:focus,
a:hover,
a:visited {
  color: #333333;
  font-family: Arial;
  text-decoration: none;
  font-weight: bold;
}

.wine-link {
  color: #333333;
  font-family: Arial;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid #ff5fff;
  width: fit-content;
}
</style>
