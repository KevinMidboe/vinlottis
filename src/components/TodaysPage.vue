<template>
  <div class="container">
    <h1 class="title">Dagens viner</h1>
    <div class="wines-container">
      <Wine :wine="wine" v-for="wine in wines" :key="wine" />
    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import { prelottery } from "@/api";
import Banner from "@/ui/Banner";
import Wine from "@/ui/Wine";

export default {
  components: {
    Banner,
    Wine
  },
  data() {
    return {
      wines: []
    };
  },
  async mounted() {
    prelottery().then(wines => this.wines = wines);
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/variables";

.wine-image {
  height: 250px;
}

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.wines-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 2rem;
  gap: 2rem;

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

  @include mobile {
    width: auto;
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
  border-bottom: 1px solid $link-color;
  width: fit-content;
}
</style>
