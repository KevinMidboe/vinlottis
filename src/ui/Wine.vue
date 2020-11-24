<template>
  <div class="wine">
    <slot name="top"></slot>
    <div class="wine-image">
      <img
        v-if="wine.image && loadImage"
        :src="wine.image"
      />
      <img v-else class="wine-placeholder" alt="Wine image" />
    </div>

    <div class="wine-details">
      <span v-if="wine.name" class="wine-name">{{ wine.name }}</span>
      <span v-if="wine.rating"><b>Rating:</b> {{ wine.rating }}</span>
      <span v-if="wine.price"><b>Pris:</b> {{ wine.price }} NOK</span>
      <span v-if="wine.country"><b>Land:</b> {{ wine.country }}</span>
    </div>

    <slot></slot>

    <div class="bottom-section">
      <slot name="bottom"></slot>
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
  },
  data() {
    return {
      loadImage: false
    }
  },
  methods: {
    setImage(entries) {
      const { target, isIntersecting } = entries[0];
      if (!isIntersecting) return;

      this.loadImage = true;
      this.observer.unobserve(target);
    }
  },
  created() {
    this.observer = new IntersectionObserver(this.setImage, {
      root: this.$el,
      threshold: 0
    })
  },
  mounted() {
    this.observer.observe(this.$el);
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries";
@import "@/styles/variables";

.wine {
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);

  @include tablet {
    width: 250px;
    height: 100%;
  }
}

.wine-image {
  display: flex;
  justify-content: center;
  margin-top: 10px;

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

  > span {
    margin-bottom: 0.5rem;
  }
}

.wine-name{
  font-size: 20px;
  margin: 1em 0;
}

.wine-details {
  display: flex;
  flex-direction: column;
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