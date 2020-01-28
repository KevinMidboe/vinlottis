<template>
  <div class="app-container">
    <banner />
    <router-view />
  </div>
</template>

<script>
import banner from "@/ui/Banner";
export default {
  name: "vinlottis",
  components: { banner },
  props: {},
  data() {
    return {};
  },
  mounted() {
    console.log("SNEAKY PETE!");
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(serviceWorker => {
          console.log(
            "Arbeids arbeideren din er installert. Du kan nå gå offline frem til neste trekning."
          );
        })
        .catch(error => {
          console.error("Arbeids arbeideren klarer ikke arbeide.", error);
        });
    }
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
.app-container {
  background-color: white;
  min-height: 100vh;
}
</style>
