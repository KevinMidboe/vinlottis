<template>
  <div class="main-container">

    <section class="top-container">

      <h1 class="want-to-win">
        Vil du også vinne?
      </h1>

      <a href="#" class="participate-button">
        <i class="icon icon--arrow-right"></i>
        <p>Trykk her for å delta</p>
      </a>

      <a href="#" class="see-details-link">
        Se vipps detaljer og QR-kode
      </a>

      <div class="icons-container">
        <i class="icon icon--heart-sparks"></i>
        <i class="icon icon--face-1"></i>
        <i class="icon icon--face-3"></i>
        <i class="icon icon--ballon"></i>

        <i class="icon icon--bottle"></i>
        <i class="icon icon--bottle"></i>
        <i class="icon icon--bottle"></i>
        <i class="icon icon--bottle"></i>
        <i class="icon icon--bottle"></i>
      </div>

    </section>
    
    <section class="content-container">

      <div class="scroll-info">  
        <i class ="icon icon--arrow-long-right"></i>
        <p>Scroll for å se vinnere og annen gøy statistikk</p>
      </div>

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

.top-container {
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

  @include mobile{
    padding-bottom: 2em;
    height: 15em;
    grid-template-rows: repeat(7, 1fr);
  }

  .want-to-win {
    grid-row: 2 / 4;
    grid-column: 2 / -1;
    font-size: 2em;
    font-weight: 400;

    @include tablet {
      font-size: 3em;
      grid-row: 2 / 4;
      grid-column: 3 / -3;
    }
  }

  .participate-button {
    grid-row: 4 / 6;
    grid-column: 2 / -1;

    background: inherit;
    border: 4px solid black;
    padding: 0 1em 0 1em;
    display: flex;
    width: 12.5em;
    column-gap: 15px;
    align-items: center;
    text-decoration: none;
    color: black;
    
    i {
      color: $link-color;
      margin-left: 5px;
    }

    p {
      font-size: 16px;
    }

    @include tablet {
      grid-row: 4 / 6;
      grid-column: 3 / -3;
    }
  }

  .see-details-link {
    grid-row: 6 / 8;
    grid-column: 2 / -1;
    
    @include tablet {
      grid-row: 6 / 8;
      grid-column: 2 / 10;
    }

    @include tablet {
      grid-column: 3 / -3;
    }

    font-weight: bold;
    color: black;
    font-weight: 200;
    font-size: 1.3em;

    text-decoration: underline;
    text-decoration-color: $link-color;
    text-underline-position: under;
  }

  .icons-container {
    grid-column: 1 / -1;
    grid-row: 7 / -1;
    @include mobile{
      margin-top: 2em;
      display: none;
    }

    @include tablet {
      grid-row: 6 / -1;
      grid-column: 7 / -1;
    }

    @include desktop{
      grid-row: 4 / -3;
      grid-column: 7 / 11;
    }

    @include widescreen {
      grid-column: 6 / 10;
    }

    width: 100%;
    min-width: 375px;
    height: 100%;
    display: grid;
    grid: repeat(6, 1fr) / repeat(12, 1fr);

    i {
      font-size: 5em;

      &.icon--heart-sparks{
        grid-column: 2 / 4;
        grid-row: 2 / 4;
        align-self: center;
        justify-self: center;

      }
      &.icon--face-1{
        grid-column: 4 / 7;
        grid-row: 2 / 4;
        justify-self: center;

      }
      &.icon--face-3{
        grid-column: 7 / 10;
        grid-row: 1 / 4;
        align-self: center;
      }
      &.icon--ballon{
        grid-column: 9 / 11;
        grid-row: 3 / 5;

      }
      &.icon--bottle{
        grid-row: 4 / -1;

        &:nth-of-type(5) {
          grid-column: 4 / 5;
          align-self: center;
        }
        &:nth-of-type(6) {
          grid-column: 5 / 6;
        }
        &:nth-of-type(7) {
          grid-column: 6 / 7;
          align-self: center;
        }
        &:nth-of-type(8) {
          grid-column: 7 / 8;
        }
        &:nth-of-type(9){
          grid-column: 8 / 9;
          align-self: center;
        }
      }
    }
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

.content-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  row-gap: 5em;
  
  .scroll-info {
      display: flex;
      align-items: center;
      column-gap: 10px;
      grid-column: 2 / -2;
  }

  .chart-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    grid-column: 2 / -2;
  }
  .total-bought {
    grid-column: 2 / -2;
  }

  .highscore {
    grid-column: 2 / -2;
  }

  .wines-container {
    grid-column: 2 / -2;
  }

  .icon--arrow-long-right {
    rotate: 90deg;
    color: $link-color;
  }

  @include tablet {

    .scroll-info{
      grid-column: 3 / -3;
    }

    .chart-container {
      grid-column: 3 / -3;
      flex-direction: row;
    }

    .total-bought {
      grid-column: 3 / -3;
    }

    .highscore {
      grid-column: 3 / -3;
    }

    .wines-container {
      grid-column: 3 / -3;
    }
  }
}
</style>
