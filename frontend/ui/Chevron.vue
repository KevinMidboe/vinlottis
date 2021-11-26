<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down" :class="{rotate}"><polyline points="6 9 12 15 18 9"></polyline></svg>
</template>

<script>
export default {
  props: {
    rotate: false,
  }
}
</script>

<style lang="scss" scoped>
.feather-chevron-down {
  transition: all .3s ease;
  transform-origin: 12px;

  &.rotate {
    transform: rotate(-180deg);
  }
}
</style>