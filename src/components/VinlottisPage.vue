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
    
    <section class="container">
      <p class="scroll-info"> | Scroll for å se annen gøy statistikk</p>

      <Highscore class="highscore"/>
      <TotalBought class="total-bought" />
      
      <section class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </section>
      
      <Wines class="wines-container" />
    </section>
    
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

  @include tablet {
    .chart-container {
      display: flex;
      width: 100%;
    }

    display: grid;
    grid-template-columns: repeat(12, 1fr);

    .scroll-info {
      grid-column: 3 / -3;
    }

    .chart-container {
      grid-column: 3 / -3;
    }

    .total-bought {
      grid-column: 3 / -3;
    }

    .highscore {
      grid-column: 3 / -3;
      align-self: baseline;
    }

    .wines-container {
      grid-column: 3 / -3;
    }
  }

  // @include desktop {

  
  // }
  
  // @include widescreen {
  
  // }
}


</style>
