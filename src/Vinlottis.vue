<template>
  <div class="app-container">
    <banner v-if="!mobileView"/>
    <MobileBanner v-if="mobileView" />
    <router-view />
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
import UpdateToast from "@/ui/UpdateToast";
import MobileBanner from "@/ui/MobileBanner";

export default {
  name: "vinlottis",
  components: { banner, UpdateToast, MobileBanner },
  props: {},
  data() {
    return {
      showToast: false,
      toastText: null,
      refreshToast: false,
      mobileView: false
    };
  },
  beforeMount(){
    this.handleView()
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
    handleView(){
      console.log(window.innerWidth <= 768)
      this.mobileView = window.innerWidth <= 768;
    }
  }
};
</script>

<style lang="scss">
@import "./styles/global.scss";
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
  background-color: #dbeede;
}
</style>

<style scoped>
.app-container {
  background-color: white;
  min-height: 100vh;
}
</style>
