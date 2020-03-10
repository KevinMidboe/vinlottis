<template>
  <div class="container">
    <div class="inner-wine-container" :class="{ 'big': fullscreen }">
      <div class="left">
        <img v-if="wine.image" :src="wine.image" class="wine-image" :class="{ 'fullscreen': fullscreen }" />
        <img v-else class="wine-placeholder" alt="Wine image" />
      </div>
      <div class="right">
        <h2 v-if="wine.name">{{ wine.name }}</h2><h2 v-else>(no name)</h2>
        <span v-if="wine.rating">{{ wine.rating }} rating</span>
        <span v-if="wine.price">{{ wine.price }} NOK</span>
        <span v-if="wine.country">{{ wine.country }}</span>

        <a v-if="wine.vivinoLink" :href="wine.vivinoLink" class="wine-link">Les mer</a>
      </div>
    </div>

    <slot></slot>
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
@import "./src/styles/variables";

.wine-image {
  height: 250px;

  @include mobile {
    max-width: 90px;
    object-fit: cover;
  }

  &.fullscreen {
    @include desktop {
      height: 100%;
      max-height: 65vh;
      max-width: 275px;
      object-fit: cover;
    }
  }
}
.wine-placeholder {
  height: 250px;
  width: 70px;
}

h2 {
  width: 100%;
  max-width: 30vw;

  @include mobile {
    max-width: 50vw;
  }
}

.container {
  margin-bottom: 30px;
}

.inner-wine-container {
  display: flex;
  flex-direction: row;
  font-family: Arial;
  width: 100%;

  &.big {
    align-items: center;
  }

  @include desktop {
    max-width: 600px;
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

.button-container {
  & button.red {
    background-color: $light-red;
    color: $red;
  }
}
</style>