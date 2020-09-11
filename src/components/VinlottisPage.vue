<template>
  <div class="outer">
    <div class="container">
      <section class="header-and-notification">
        <h1 @click="startCountdown">Vinlotteri</h1>
        <img
          src="/public/assets/images/notification.svg"
          alt="Notification-bell"
          @click="requestNotificationAccess"
          class="notification-request-button"
          role="button"
          v-if="notificationAllowed"
        />
      </section>
      <section class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </section>
      <TotalBought class="total-bought" />
      <Highscore class="highscore"/>
      <Wines class="wines-container" />
      <Vipps class="vipps-icon" />
    </div>
    <Countdown :hardEnable="hardStart" @countdown="changeEnabled" />
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import PurchaseGraph from "@/ui/PurchaseGraph";
import TotalBought from "@/ui/TotalBought";
import Highscore from "@/ui/Highscore";
import WinGraph from "@/ui/WinGraph";
import Wines from "@/ui/Wines";
import Vipps from "@/ui/Vipps";
import Countdown from "@/ui/Countdown";
import { prelottery } from "@/api";

export default {
  components: {
    PurchaseGraph,
    TotalBought,
    Highscore,
    WinGraph,
    Wines,
    Vipps,
    Countdown
  },
  data() {
    return {
      hardStart: false,
      pushAllowed: false
    };
  },
  computed: {
    notificationAllowed: function() {
      if (!("PushManager" in window)) {
        return false;
      }
      return (
        Notification.permission !== "granted" ||
        !this.pushAllowed ||
        localStorage.getItem("push") == null
      );
    }
  },
  async mounted() {
    this.$on("push-allowed", () => {
      this.pushAllowed = true;
    });
    if (window.location.hostname == "localhost") {
      return;
    }
    this.track();
  },
  methods: {
    requestNotificationAccess() {
      this.$root.$children[0].registerServiceWorkerPushNotification();
    },
    changeEnabled(way) {
      this.hardStart = way;
    },
    track() {
      this.$ga.page("/");
    },
    startCountdown() {
      this.hardStart = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";

.outer {
  margin: 1em;
}

.container{
  display: flex;
  flex-direction: column;
  
  .header-and-notification{
    display: flex;
    margin: auto;
  }

  .vipps-icon{
    margin: auto;
  }

  @include tablet {
    margin: 3em;
    .chart-container{
      display: flex;
      width: 100%;
    }
  }

  @include desktop {

    display: grid;
    grid: auto-flow min-content / 1fr 1fr 1fr;
    grid-template-areas: "top top top"
                         "middle-top middle-top middle-top"
                         "middle-bot middle-bot aside"
                         "bot-left bot-right aside";
    grid-gap: 1em;

    .header-and-notification {
      grid-area: top;
    }

    .chart-container{
      grid-area: middle-top;
    }

    .total-bought{
      grid-area: middle-bot;
      border-bottom: 1px solid rgb(237, 237, 237);
    }

    .highscore {
      grid-area: bot-left;
    }

    .wines-container{
      grid-area: bot-right;
    }

    .vipps-icon{
      grid-area: aside;
      padding-left: 30px;
      border-left: 1px solid rgb(237, 237, 237);
    }
  }
  
  @include widescreen {
    width: 70%;
    max-width: 1800px;
    margin: auto;
  }
}


</style>
