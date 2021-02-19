<template>
  <div class="container">
    <h1 class="title">Dagens viner</h1>
    <div class="wines-container">
      <Wine :wine="wine" v-for="wine in wines" :key="wine" />
    </div>
  </div>
</template>

<script>
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
    fetch("/api/lottery/wines")
      .then(resp => resp.json())
      .then(response => (this.wines = response.wines));
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries";
@import "@/styles/variables";

.wine-image {
  height: 250px;
}

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.wines-container {
  width: 90vw;
  padding: 5vw;

  @include desktop {
    width: 80vw;
    padding: 0 10vw;
  }

  @media (min-width: 1500px) {
    max-width: 1500px;
    margin: 0 auto;
  }
}

h3 {
  max-width: 30vw;

  @include mobile {
    max-width: 50vw;
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
