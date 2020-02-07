<template>
  <div class="outer">
    <div class="container">
      <h1 class="title">Alle viner</h1>
      <div class="wines-container">
        <a :href="wine.vivinoLink" v-for="wine in wines">
          <div class="inner-wine-container">
            <div class="left">
              <!-- <img :src="wine.image" class="wine-image" /> -->
              <img
                src="https://images.vivino.com/thumbs/Mzt8QNxpSfa4W6Sgf02Ruw_pb_x960.png"
                class="wine-image"
              />
            </div>
            <div class="right">
              <h2>{{ wine.name }}</h2>
              <span v-if="wine.rating">{{ wine.rating }} rating</span>

              <a :herf="wine.vivinoLink" class="wine-link">Les mer</a>
              <span class="name-wins">
                Vunnet av:
                {{wine.winners.join(", ")}}
              </span>
              <div class="color-wins">
                <span class="color-win blue">{{wine.blue == undefined ? 0 : wine.blue}}</span>
                <span class="color-win red">{{wine.red == undefined ? 0 : wine.red}}</span>
                <span class="color-win green">{{wine.green == undefined ? 0 : wine.green}}</span>
                <span class="color-win yellow">{{wine.yellow == undefined ? 0 : wine.yellow}}</span>
              </div>
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
    const _wines = await fetch("/api/wines/statistics/overall");
    this.wines = await _wines.json();
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";

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
    max-width: 1000px;
    margin: 0 auto;
  }

  @include mobile {
    flex-direction: column;
  }
}

.name-wins,
.color-wins {
  display: flex;
  width: 60%;
  flex-wrap: wrap;
}

span.color-win {
  border: 2px solid transparent;
  color: #333;
  display: block;
  padding: 30px;
  font-size: 1.3rem;
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  /* max-height: calc(3rem + 18px); */
  /* max-width: calc(3rem + 18px); */
  width: 1rem;
  margin: 10px;
  touch-action: manipulation;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @include mobile {
    margin: 2px;
    padding: 10px;
    font-size: 1rem;
  }

  &.green {
    background: #c8f9df;
  }
  &.blue {
    background: #d4f2fe;
  }
  &.red {
    background: #fbd7de;
  }
  &.yellow {
    background: #fff6d6;
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
    margin-bottom: 50px;
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
