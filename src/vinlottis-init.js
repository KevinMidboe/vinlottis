import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "@/router.js";
import Vinlottis from "@/Vinlottis";
import VueAnalytics from "vue-analytics";

import "core-js/stable"; // babel polyfill

Vue.use(VueRouter);
Vue.use(VueAnalytics, {
  id: "UA-156846886-1"
});

const router = new VueRouter({
  routes: routes
});

new Vue({
  el: "#app",
  router,
  components: { Vinlottis },
  template: "<Vinlottis/>",
  render: h => h(Vinlottis)
});
