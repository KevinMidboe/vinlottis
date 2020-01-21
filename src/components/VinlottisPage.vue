<template>
  <div class="outer">
    <div class="container">
      <h1>Knowit Vinlottis</h1>
      <router-link to="generate" class="generate-link">Klarer du ikke velge lodd-farger?</router-link>
      <div class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </div>
      <TotalBought />
      <div class="wine-and-highscore-container">
        <Highscore />
        <Wines />
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseGraph from "@/ui/PurchaseGraph";
import TotalBought from "@/ui/TotalBought";
import Highscore from "@/ui/Highscore";
import WinGraph from "@/ui/WinGraph";
import Wines from "@/ui/Wines";

export default {
  components: {
    PurchaseGraph,
    TotalBought,
    Highscore,
    WinGraph,
    Wines
  }
};
</script>

<style lang="scss" scoped>
.outer {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
h1 {
  width: 100vw;
  text-align: center;
  font-family: sans-serif;
}

.generate-link {
  color: white;
  text-align: center;
  font-size: 1.2rem;
  padding: 5px;
  margin: auto;
  width: fit-content;
  display: block;
  text-decoration: none;
  background: orange;
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
  height: 50vh;
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
