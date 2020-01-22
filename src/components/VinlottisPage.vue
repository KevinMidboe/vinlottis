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
      <TotalBought />
      <img src="/public/assets/images/vipps.png" class="vipps-image" />
      <!--<div class="wine-and-highscore-container">
        <Highscore />
        <Wines />
      </div>-->
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

export default {
  components: {
    PurchaseGraph,
    TotalBought,
    Highscore,
    WinGraph,
    Banner,
    Wines
  }
};
</script>
<style lang="scss">
body {
  margin: 0;
  color: #333333;
  font-family: "knowit";
  padding-bottom: 30px;
}
</style>
<style lang="scss" scoped>
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
  flex-direction: row;
  justify-content: space-evenly;
  align-items: baseline;
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

  .wine-and-highscore-container {
    flex-direction: column;
  }
}
</style>
