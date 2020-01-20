<template>
  <div class="outer">
    <div class="container">
      <h1>Knowit Vinlottis</h1>
      <router-link to="generate" class="generate-link"
        >Klarer du ikke velge lodd-farger?</router-link
      >
      <div class="chart-container">
        <PurchaseGraph class="purchase" />
        <WinGraph class="win" />
      </div>
      <TotalBought />
      <Highscore />
    </div>
  </div>
</template>

<script>
import PurchaseGraph from "@/ui/PurchaseGraph";
import TotalBought from "@/ui/TotalBought";
import Highscore from "@/ui/Highscore";
import WinGraph from "@/ui/WinGraph";

export default {
  components: {
    PurchaseGraph,
    TotalBought,
    Highscore,
    WinGraph
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

.purchase {
  width: 50vw;
  display: inline-block;
}

.win {
  width: 45vw;
  display: inline-block;
}
</style>
