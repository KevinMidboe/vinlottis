import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "@/router.js";
import Vinlottis from "@/Vinlottis";
import VueAnalytics from "vue-analytics";

import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";

Vue.use(VueRouter);
Vue.use(VueAnalytics, {
  id: "UA-156846886-1"
});

Sentry.init({
  dsn: "https://7debc951f0074fb68d7a76a1e3ace6fa@o364834.ingest.sentry.io/4905091",
  integrations: [
    new VueIntegration({
      Vue,
      tracing: true
    }),
    new Integrations.BrowserTracing(),
  ]
})

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

