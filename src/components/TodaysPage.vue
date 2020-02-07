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
              <span v-if="wine.rating">{{ wine.rating }} rating</span>
              <span class="wine-link">Les mer</span>
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
@import './src/styles/media-queries';

.wine-image {
  height: 250px;
}

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.wines-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 0 2rem;

  @media (min-width: 1500px) {
    max-width: 1500px;
    margin: 0 auto;
  }

  @include mobile {
    flex-direction: column;
  }
}

h3 {
  max-width: 30vw;

  @include mobile {
    max-width: 50vw;
  }
}

.inner-wine-container {
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 500px;
  font-family: Arial;
  margin-bottom: 30px;

  @include desktop {
    justify-content: center;
  }
}

.right {
  display: flex;
  flex-direction: column;
  margin-bottom: 150px;
  margin-left: 50px;

  @include mobile {
    margin-left: 2rem;
  }
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
