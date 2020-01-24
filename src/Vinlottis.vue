<template>
  <div class="container">
    <banner />
    <router-view />
    <Countdown />
  </div>
</template>

<script>
import banner from "@/ui/Banner";
import Countdown from "@/ui/Countdown";
export default {
  name: "vinlottis",
  components: { banner, Countdown },
  props: {},
  data() {
    return {};
  },
  mounted() {
    console.log("SNEAKY PETE!");
  },
  computed: {},

  methods: {}
};
</script>

<style lang="scss">
@import "./styles/global.scss";
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

body {
  background-color: #dbeede;
}
</style>

<style scoped>
.container {
  background-color: white;
  min-height: 100vh;
}
</style>
