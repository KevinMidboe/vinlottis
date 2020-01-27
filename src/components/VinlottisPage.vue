<template>
  <div class="outer">
    <div class="container">
      <h1 class="title" @click="startCountdown">Vinlotteri</h1>
      <router-link to="generate" class="generate-link">
        Klarer du ikke velge lodd-farger?
        <span class="subtext generator-link">Prøv loddgeneratoren</span>
      </router-link>
      <div class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </div>
      <div class="bottom-container">
        <div class="left-bottom">
          <TotalBought />
          <hr class="bought-and-highscore-separator" />
          <div class="highscore-and-wines">
            <Highscore />
            <Wines class="wines-container" />
          </div>
        </div>
        <div class="vipps-outer-container">
          <Vipps class="vipps-container" />
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
      hardStart: false
    };
  },
  mounted() {
    if (window.location.hostname == "localhost") {
      return;
    }
    this.track();
  },
  methods: {
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

.bottom-container {
  display: flex;
  flex-direction: row;
  max-width: 1350px;
  margin: auto;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 25px;
}

.title {
  cursor: pointer;
}

.left-bottom {
  width: 75%;

  @include mobile {
    width: 100%;
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
}

.wines-container {
  margin-left: 30px;
}

.vipps-outer-container {
  display: flex;
  align-items: center;

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
  border-bottom: 1px solid #ff5fff;
}

.win,
.purchase {
  width: 48%;
  display: inline-block;
}

.vipps-container {
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 30px;
}

.chart-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  max-width: 1400px;
  margin: auto;
  padding: 50px 0;
}

.wine-and-highscore-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 25px;
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
