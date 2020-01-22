<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "vinlottis",
  components: {},
  props: {},
  data() {
    return {};
  },
  mounted() {
    console.log("moutned");
  },
  computed: {},

  methods: {}
};
</script>

<style lang="scss">
@font-face {
  font-family: "knowit";
  font-weight: 600;
  src: url("/../public/assets/fonts/bold.eot"),
    url("/../public/assets/fonts/bold.woff") format("woff");
}

@font-face {
  font-family: "knowit";
  font-weight: 300;
  src: url("/../public/assets/fonts/regular.eot"),
    url("/../public/assets/fonts/regular.woff") format("woff");
}
</style>
