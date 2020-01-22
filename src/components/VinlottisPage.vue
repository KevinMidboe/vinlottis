<template>
  <div class="outer">
    <div class="container">
      <h1>Vinlotteri</h1>
      <router-link to="generate" class="generate-link">
        Klarer du ikke velge lodd-farger?
        <span class="generator-link">Prøv loddgeneratoren</span>
      </router-link>
      <div class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </div>

      <!-- <img src="/public/assets/images/vipps.png" class="vipps-image" /> -->
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
  </div>
</template>

<script>
import PurchaseGraph from "@/ui/PurchaseGraph";
import TotalBought from "@/ui/TotalBought";
import Highscore from "@/ui/Highscore";
import WinGraph from "@/ui/WinGraph";
import Banner from "@/ui/Banner";
import Wines from "@/ui/Wines";
import Vipps from "@/ui/Vipps";

export default {
  components: {
    PurchaseGraph,
    TotalBought,
    Highscore,
    WinGraph,
    Banner,
    Wines,
    Vipps
  }
};
</script>
<style lang="scss">

body {
  margin: 0;
  color: #333333;
  font-family: sans-serif;
  padding-bottom: 30px;
}
</style>
<style lang="scss" scoped>
@import '../styles/media-queries.scss';

.bottom-container {
  display: flex;
  flex-direction: row;
  max-width: 1350px;
  margin: auto;
  justify-content: space-evenly;
  align-items: center;
}

.left-bottom {
  width: 75%;
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

@font-face {
  font-family: "knowit";
  font-weight: 600;
  src: url("/../../public/assets/fonts/bold.eot");
}

@font-face {
  font-family: "knowit";
  font-weight: 300;
  src: url("/../../public/assets/fonts/regular.eot");
}
.outer {
  height: 100vh;
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

@media only screen and (max-width: 768px) {
  .purchase,
  .win {
    width: 100vw;
  }

  .generate-link {
    margin-bottom: 30px;
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .outer {
    justify-content: flex-start;
  }

  .bottom-container,
  .highscore-and-wines {
    flex-direction: column;
  }

  .wines-container,
  .vipps-outer-container {
    margin-left: 0px;
  }
}
</style>
