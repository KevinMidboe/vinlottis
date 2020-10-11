import Vue from "vue";
import VueRouter from "vue-router";
import VinlottisRouter from "@/router.js";
import Vinlottis from "@/Vinlottis";
import VueAnalytics from "vue-analytics";

Vue.use(VueRouter);
Vue.use(VueAnalytics, {
  id: "UA-156846886-1"
});

new Vue({
  el: "#app",
  router: VinlottisRouter,
  components: { Vinlottis },
  template: "<Vinlottis/>",
  render: h => h(Vinlottis)
});
