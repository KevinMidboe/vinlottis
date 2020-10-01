<template>
  <div class="outer">
    <section class="top-info">

      <h1 class="want-to-win">
        Vil du også vinne?
      </h1>

      <a href="#" class="participate-button">
        <i> -> </i>
        <p>Trykk her for å delta</p>
      </a>

      <a href="#" class="see-details-link">
        
        Se vipps detaljer og QR-kode
      </a>


    </section>
    
    <div class="container">
      <!-- <span> Scroll for å annen gøy statistikk</span> -->
      

      
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


      <div class="to-lottery-container">
        <a href="#/lottery" class="to-lottery">Vil du til lotteriet?<span class="vin-link">Trykk her</span></a>
      </div>
      
      <section class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </section>
      
      
      <TotalBought class="total-bought" />
      <Vipps class="vipps-icon" />
      <Highscore class="highscore"/>
      <Wines class="wines-container" />
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
@import "../styles/variables.scss";

.top-info {
  height: 30em;
  background-color: $primary;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  align-items: center;
  justify-items: start;

  .want-to-win {
    grid-column: 3 / 7;
    grid-row: 4 / 6;
    font-size: 3em;
    font-weight: 400;
  }

  .participate-button {
    
    grid-column: 3 / 7;
    grid-row: 6 / 8;
    background: inherit;
    border: 4px solid black;
    padding: 0 1em 0 1em;
    display: flex;
    width: 15em;
    justify-content: space-evenly;
    align-items: center;
    text-decoration: none;
    color: black;
    
    i {
      color: $link-color;
    }

    p {
      font-size: 16px;
    }
  }

  .see-details-link {
    grid-column: 3 / 7;
    grid-row: 8 / 10;
    font-weight: bold;
    color: black;
    font-weight: 200;
    font-size: 1.3em;

    text-decoration: underline;
    text-decoration-color: $link-color;
    text-underline-position: under;
  }

}

h1 {
  text-align: center;
  font-family: "knowit";
}

.to-lottery{
    color: #333;
    text-decoration: none;
    display: block;
    text-align: center;
    margin-bottom: 0;
}

.container{
  display: flex;
  flex-direction: column;
  
  .header-and-notification{
    display: flex;
    flex-direction: row;
    margin: auto;
  }

  .vipps-icon{
    margin: 1em;
  }

  @include tablet {
    margin: .5em;
    .chart-container {
      display: flex;
      width: 100%;
    }

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto-flow min-content;
    grid-template-areas: "top-top top-top top-top"
                         "top-bot top-bot top-bot"
                         "middle-top middle-top middle-top"
                         "middle-bot-left middle-bot-left middle-bot-right"
                         "bot-left bot-right bot-right";

    .header-and-notification {
      grid-area: top-top;
    }

    .to-lottery-container{
      grid-area: top-bot;
    }

    .chart-container {
      grid-area: middle-top;
    }

    .total-bought {
      grid-area: middle-bot-left;
    }

    .highscore {
      border-top: 1px solid rgb(237, 237, 237);
      grid-area: bot-left;
      align-self: baseline;
    }

    .wines-container {
      border-top: 1px solid rgb(237, 237, 237);
      padding-left: 1em;
      border-left: 1px solid rgb(237, 237, 237);
      grid-area: bot-right;
    }

    .vipps-icon {
      padding-left: 1em;
      align-self: center;
      grid-area: middle-bot-right;
      border-left: 1px solid rgb(237, 237, 237);
    }
  }

  @include desktop {

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto-flow min-content;
    grid-template-areas: "top-top top-top top-top top-top"
                         "top-bot top-bot top-bot top-bot"
                         "middle-top middle-top middle-top middle-top"
                         "middle-bot middle-bot middle-bot aside"
                         "bot-left bot-right bot-right aside";
    grid-gap: 1em;
    align-items: center;

    .header-and-notification {
      grid-area: top-top;
    }

    .to-lottery-container {
      grid-area: top-bot;
    }

    .chart-container {
      grid-area: middle-top;
    }

    .total-bought {
      grid-area: middle-bot;
      border-bottom: 1px solid rgb(237, 237, 237);
    }

    .highscore {
      border: none;
      grid-area: bot-left;
    }

    .wines-container {
      border: none;
      grid-area: bot-right;
    }

    .vipps-icon {
      grid-area: aside;
      padding-left: 3em;
      border-left: 1px solid rgb(237, 237, 237);
    }
  }
  
  @include widescreen {
    width: 70%;
    max-width: 1800px;
    margin: auto;

    .vipps-icon {
      padding-left: 6em;
    }
  }
}


</style>
