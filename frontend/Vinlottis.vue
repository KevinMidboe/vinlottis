<template>
  <div class="app-container">
    <banner :routes="routes" />
    <router-view />
    <Footer />
    <UpdateToast v-if="showToast" :text="toastText" :refreshButton="refreshToast" v-on:closeToast="closeToast" />
  </div>
</template>

<script>
import ServiceWorkerMixin from "@/mixins/ServiceWorkerMixin";
import banner from "@/ui/Banner";
import Footer from "@/ui/Footer";
import UpdateToast from "@/ui/UpdateToast";

export default {
  name: "vinlottis",
  components: { banner, UpdateToast, Footer },
  props: {},
  data() {
    return {
      showToast: false,
      toastText: null,
      refreshToast: false,
      routes: [
        {
          name: "Virtuelt lotteri",
          route: "/lottery"
        },
        {
          name: "Dagens viner",
          route: "/dagens/"
        },
        {
          name: "Highscore",
          route: "/highscore"
        },
        {
          name: "Historie",
          route: "/history/"
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
          name: "Login",
          route: "/login"
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
@import "styles/global.scss";
@import "styles/positioning.scss";
@import "styles/vinlottis-icons";

body {
  background-color: $primary;
}
</style>

<style lang="scss" scoped>
.app-container {
  background-color: white;
  min-height: 100vh;
  display: grid;
  grid-template-rows: 80px auto 100px;

  .main-container {
    height: 100%;
    width: 100%;
  }
}
</style>
