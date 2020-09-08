<template>
  <div class="outer">
    <div class="container">
      <div class="header-top">
        <h1 class="title" @click="startCountdown">Vinlotteri</h1>
        <img
          src="/public/assets/images/notification.svg"
          alt="Notification-bell"
          @click="requestNotificationAccess"
          class="notification-request-button"
          role="button"
          v-if="notificationAllowed"
        />
      </div>
      <router-link to="lottery" class="generate-link">
        Vil du til lotteriet?
        <span class="subtext generator-link">Trykk her</span>
      </router-link>
      <div class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </div>
      <router-link to="dagens" class="generate-link">
        Lurer du på dagens fangst?
        <span class="subtext generator-link">Se her</span>
      </router-link>
      <div class="bottom-container">
        <div class="left-bottom">
          <TotalBought />
          <hr class="bought-and-highscore-separator" />
          <div class="highscore-and-wines">
            <Highscore class="highscore-container" />
            <Wines class="wines-container" />
          </div>
        </div>
        <div class="vipps-outer-container">
          <Vipps class="vipps-inner-container" />
        </div>
      </div>
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
import Banner from "@/ui/Banner";
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
    Banner,
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
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.notification-request-button {
  cursor: pointer;
  margin-left: 15px;
}

.bottom-container {
  display: flex;
  flex-direction: row;
  max-width: 1350px;
  margin: auto;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 30px;

  @include mobile {
    padding: 0;
  }
}

.header-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 3.8rem;

  @include mobile {
    margin-top: 1.5rem;
  }

  .title {
    cursor: pointer;
    margin: auto 0;
  }
}

.left-bottom {
  width: 75%;

  @include mobile {
    width: calc(100% - 20px);
    padding: 0;
  }
}

.bought-and-highscore-separator {
  border: none;

  @include desktop {
    border-bottom: 1px solid rgb(237, 237, 237);
  }
}

.highscore-and-wines {
  display: flex;
  flex-direction: row;
  padding-top: 1.5rem;
  justify-content: space-between;

  @include mobile {
    padding: 0 20px;
  }

  .highscore-container {
    @include mobile {
      width: 100%;
    }
  }

  .wines-container {
    width: 65%;

    @include mobile {
      width: 100%;
    }
  }
}

.vipps-outer-container {
  display: flex;
  align-items: flex-start;

  @include desktop {
    margin-left: 20px;
    border-left: 1px solid rgb(237, 237, 237);
  }
}

.container {
  margin-bottom: 2.5rem;
}

.outer {
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
}
h1 {
  width: 100vw;
  text-align: center;
  font-family: "knowit";
}

.generate-link {
  color: #333333;
  text-decoration: none;
  display: block;
  width: 100vw;
  text-align: center;
  margin-bottom: 0px;

  @include mobile {
    width: 60vw;
    margin: auto;
  }
}

.vipps-image {
  width: 250px;
  margin: auto;
  display: block;
  margin-top: 30px;
}

.generator-link {
  font-weight: bold;
  border-bottom: 1px solid $link-color;
}

.win,
.purchase {
  width: 48%;
  display: inline-block;
}

.vipps-inner-container {
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 30px;

  @include mobile {
    margin: auto;
  }
}

.chart-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 99vw;
  max-width: 1400px;
  margin: auto;
  padding: 50px 0;
}

.wine-and-highscore-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 20vw;
  border-right: 1px solid #333;
}

@include mobile {
  .purchase,
  .win {
    width: 100vw;
  }

  .generate-link {
    margin-bottom: 30px;
  }

  .chart-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 0;
    margin-top: 30px;
  }

  .outer {
    justify-content: flex-start;
  }

  .bottom-container,
  .highscore-and-wines {
    flex-direction: column;
  }

  .wines-container,
  .vipps-outer-container,
  .vipps-container {
    margin-left: 0px;
  }
}
</style>
