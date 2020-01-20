import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "@/routes/vinlottisRouter";
import Vinlottis from "@/Vinlottis";

Vue.use(VueRouter);

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
