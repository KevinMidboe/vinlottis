<template>
  <div class="update-toast" :class="showClass">
    <span v-html="text"></span>
    <div class="button-container">
      <button @click="closeToast">Lukk</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: true },
    refreshButton: { type: Boolean, required: false }
  },
  data() {
    return { showClass: null };
  },
  created() {
    this.showClass = "show";
  },
  mounted() {
    if (this.refreshButton) {
      return;
    }
    setTimeout(() => {
      this.$emit("closeToast");
    }, 5000);
  },
  methods: {
    refresh: function() {
      location.reload();
    },
    closeToast: function() {
      this.$emit("closeToast");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";

.update-toast {
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
  opacity: 0;
  pointer-events: none;

  &.show {
    pointer-events: all;
    opacity: 1;
  }

  -webkit-transition: opacity 0.5s ease-in-out;
  -moz-transition: opacity 0.5s ease-in-out;
  -ms-transition: opacity 0.5s ease-in-out;
  -o-transition: opacity 0.5s ease-in-out;
  transition: opacity 0.5s ease-in-out;

  @include mobile {
    width: 85vw;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  & span {
    color: white;
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

      &:active {
        background: #2d2d2d;
        color: white;
      }
    }
  }
}
</style>