<template>
  <div class="wine-container" :class="{ 'big': fullscreen }">
    <div class="left">
      <img
        v-if="wine.image"
        :src="wine.image"
        class="wine-image"
        :class="{ 'fullscreen': fullscreen }"
      />
      <img v-else class="wine-placeholder" alt="Wine image" />
    </div>
    <div class="right">
      <div>
        <h2 v-if="wine.name">{{ wine.name }}</h2>
        <h2 v-else>(no name)</h2>
        <span v-if="wine.rating">{{ wine.rating }} rating</span>
        <span v-if="wine.price">{{ wine.price }} NOK</span>
        <span v-if="wine.country">{{ wine.country }}</span>

        <a
          v-if="wine.vivinoLink"
          :href="wine.vivinoLink"
          class="wine-link"
        >Les mer på {{ hostname(wine.vivinoLink) }}</a>

        <button
          v-if="winner"
          @click="choseWine(wine.name)"
          class="vin-button"
        >Velg dette som din vin</button>
      </div>

      <slot v-if="shouldUseInlineSlot()"></slot>
    </div>

    <slot v-if="!shouldUseInlineSlot()"></slot>
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
    },
    inlineSlot: {
      type: Boolean,
      required: false,
      default: false
    },
    winner: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    shouldUseInlineSlot() {
      return this.inlineSlot && window.innerWidth > 768;
    },
    hostname(url) {
      const urlHostname = new URL(url).hostname;
      return urlHostname.split(".")[
        (urlHostname.match(/\./g) || []).length - 1
      ];
    },
    choseWine(name) {
      if (window.confirm(`Er du sikker på at du vil ha ${name}?`)) {
        this.$emit("chosen", name);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/global";
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

.wine-container {
  margin-bottom: 30px;
  font-family: Arial;
  width: 100%;
  max-width: max-content;

  &.big {
    align-items: center;
  }

  @include desktop {
    max-width: 550px;
  }
}

.left {
  float: left;
  margin-right: 3rem;

  @include mobile {
    margin-right: 2rem;
  }
}

.right {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  height: max-content;

  > div:first-of-type {
    display: flex;
    flex-direction: column;
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

.button-container {
  & button.red {
    background-color: $light-red;
    color: $red;
  }
}

.vin-button {
  margin-top: 1rem;
}
</style>