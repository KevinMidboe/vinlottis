<template>
  <transition name="slide">
    <div class="toast" :class="type" v-if="show" ref="toast">
      <div class="message">
        <span v-html="title"></span>
        <span class="description" v-if="description">
          {{ description }}
        </span>
      </div>

      <div class="button-container">
        <button @click="dismiss">Lukk</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      type: this.$root.type || "info",
      title: this.$root.title || undefined,
      description: this.$root.description || undefined,
      image: this.$root.image || undefined,
      link: this.$root.link || undefined,
      timeout: this.$root.timeout || 4500,
      show: false,
      mouseover: false,
      timedOut: false
    };
  },
  mounted() {
    // Here we set show when mounted in-order to get the transition animation to be displayed correctly
    this.show = true;
    const timeout = setTimeout(() => {
      console.log("Your toast time is up 👋");

      if (this.mouseover === false) {
        this.show = false;
      } else {
        this.timedOut = true;
      }
    }, this.timeout);

    setTimeout(() => {
      const { toast } = this.$refs;

      if (toast) {
        toast.addEventListener("mouseenter", _ => {
          this.mouseover = true;
        });

        toast.addEventListener("mouseleave", _ => {
          this.mouseover = false;

          if (this.timedOut === true) {
            this.show = false;
          }
        });
      }
    }, 10);
  },
  methods: {
    dismiss() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries.scss";

.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(100vh);
  opacity: 0;
}
.slide-leave-active {
  transition: all 2s ease;
}

.toast {
  position: fixed;
  bottom: 1.3rem;
  left: 0;
  right: 0;
  margin: auto;
  background: #2d2d2d;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80vw;

  @include mobile {
    width: 85vw;
  }

  .message {
    display: flex;
    flex-direction: column;
  }

  & span {
    color: white;

    &.description {
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }
  }

  & .button-container {
    & button {
      color: #2d2d2d;
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      margin: 0 3px;
      font-size: 0.8rem;
      height: max-content;
      border: 0;
      font-size: 0.9rem;

      &:active {
        background: #2d2d2d;
        color: white;
      }
    }
  }

  &.success {
    background-color: #5bc2a1;
    color: white;
  }

  &.info {
    background: #2d2d2d;
    color: white;
  }

  &.warning {
    border-left: 6px solid #f6993f;
  }

  &.error {
    background-color: var(--red);

    button {
      color: var(--dark-red);

      &:active {
        background-color: var(--dark-red);
        color: white;
      }
    }
  }
}
</style>
