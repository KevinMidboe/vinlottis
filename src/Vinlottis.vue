<template>
  <div class="app-container">
    <banner :routes="routes"/>
    <router-view />
    <WineFooter />
    <UpdateToast
      v-if="showToast"
      :text="toastText"
      :refreshButton="refreshToast"
      v-on:closeToast="closeToast"
    />
  </div>
</template>

<script>
import ServiceWorkerMixin from "@/mixins/ServiceWorkerMixin";
import banner from "@/ui/Banner";
import WineFooter from "@/ui/WineFooter";
import UpdateToast from "@/ui/UpdateToast";

export default {
  name: "vinlottis",
  components: { banner, UpdateToast, WineFooter },
  props: {},
  data() {
    return {
      showToast: false,
      toastText: null,
      refreshToast: false,
      routes: [
        {
          name: "Dagens viner",
          route: "/dagens/"
        },
        {
          name: "Historie",
          route: "/history/"
        },
        {
          name: "Lotteriet",
          route: "/lottery/game/"
        },
        {
          name: "Foreslå vin",
          route: "/request"
        },
        {
          name: "Foreslåtte viner",
          route: "/requested-wines"
        },
        {
          name: "Highscore",
          route: "/highscore"
        }
      ]
    };
  },
  mounted() {
    console.log("SNEAKY PETE!");
    this.$on("service-worker-updated", () => {
      this.toastText = "Det er ny oppdatering av siden, vil du oppdatere?";
      this.showToast = true;
      this.refreshToast = true;
    });
    this.$on("push-allowed", () => {
      this.toastText = "Push-notifications er skrudd på!";
      this.refreshToast = false;
      this.showToast = true;
    });
  },
  computed: {},
  mixins: [ServiceWorkerMixin],
  methods: {
    closeToast: function() {
      this.showToast = false;
    },
  }
};
</script>

<style lang="scss">
@import "./styles/global.scss";
@import "./styles/positioning.scss";
@import "./styles/style.css";

@font-face {
  font-family: "knowit";
  font-weight: 600;
  src: url("/../public/assets/fonts/bold.woff"),
    url("/../public/assets/fonts/bold.woff") format("woff"), local("Arial");
  font-display: swap;
}

@font-face {
  font-family: "knowit";
  font-weight: 300;
  src: url("/../public/assets/fonts/regular.eot"),
    url("/../public/assets/fonts/regular.woff") format("woff"), local("Arial");
  font-display: swap;
}

body {
  background-color: $primary;
}
</style>

<style scoped>
.app-container {
  background-color: white;
  min-height: 100vh;
}
</style>
