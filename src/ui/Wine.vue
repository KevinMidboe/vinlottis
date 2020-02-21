<template>
  <div class="inner-wine-container" :class="{ 'big': fullscreen }">
    <div class="left">
      <img :src="wine.image" class="wine-image" :class="{ 'fullscreen': fullscreen }" />
    </div>
    <div class="right">
      <h2>{{ wine.name }}</h2>
      <span v-if="wine.rating">{{ wine.rating }} rating</span>

      <a :href="wine.vivinoLink" class="wine-link">Les mer</a>
      <span class="name-wins" v-if="wine.winners">
        Vunnet av:
        {{wine.winners.join(", ")}}
      </span>
      <div class="color-wins" :class="{ 'big': fullscreen }">
        <span class="color-win blue">{{wine.blue == undefined ? 0 : wine.blue}}</span>
        <span class="color-win red">{{wine.red == undefined ? 0 : wine.red}}</span>
        <span class="color-win green">{{wine.green == undefined ? 0 : wine.green}}</span>
        <span class="color-win yellow">{{wine.yellow == undefined ? 0 : wine.yellow}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wine: {
      type: Object,
      required: true
    },
    fullscreen: {
      type: Boolean,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
.wine-image {
  height: 250px;

  &.fullscreen {
    @include desktop {
      height: unset;
      max-height: 65vh;
    }
  }
}

.name-wins,
.color-wins {
  display: flex;
  width: 13rem;
  flex-wrap: wrap;
}

.color-wins.big {
  width: unset;
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
  font-weight: 900;

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
  width: 500px;
  font-family: Arial;
  margin-bottom: 30px;

  &.big {
    align-items: center;
  }

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