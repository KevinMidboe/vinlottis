<template>
  <div class="wine">
    <div class="wine-image">
      <img
        v-if="wine.image"
        :src="wine.image"
      />
      <img v-else class="wine-placeholder" alt="Wine image" />
    </div>

    <div class="wine-details">
      <h2 v-if="wine.name">{{ wine.name }}</h2>
      <span v-if="wine.rating"><b>Rating:</b>{{ wine.rating }} rating</span>
      <span v-if="wine.price"><b>Pris:</b> {{ wine.price }} NOK</span>
      <span v-if="wine.country"><b>Land:</b> {{ wine.country }}</span>
    </div>

    <slot></slot>

    <div class="bottom-section">
      <a v-if="wine.vivinoLink" :href="wine.vivinoLink" class="link float-right">
        Les mer
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wine: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/global";
@import "./src/styles/variables";

.wine {
  padding: 2rem;
  margin: 1rem 0rem;
  position: relative;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);

  @include tablet {
    width: 250px;
    height: 100%;
    margin: 1rem 2rem;
  }
}

.wine-image {
  display: flex;
  justify-content: center;

  img {
    height: 250px;
    @include mobile {
      object-fit: cover;
      max-width: 90px;
    }
  }
  .wine-placeholder {
    height: 250px;
    width: 70px;
  }
}

.wine-details {
  display: flex;
  flex-direction: column;
}

h2 {
  font-weight: normal;
  font-size: 1.4rem;
  margin: 2rem 0;
  color: $matte-text-color;
}

.bottom-section {
  width: 100%;
  margin-top: 1rem;

  .link {
    color: $matte-text-color;
    font-family: Arial;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: normal;
    border-bottom: 2px solid $matte-text-color;

    &:hover {
      font-weight: normal;
      border-color: $link-color;
    }
  }
}
</style>