<template>
  <div class="bought-container">
    <div class="red-container inner-bought-container">
      <div>
        <span class="red">{{ red.total }}</span> kjøpt
      </div>
      <div>{{ red.win }} vinn</div>
      <div>{{ redPercentage }}% vinn</div>
    </div>
    <div class="blue-container inner-bought-container">
      <div>
        <span class="blue">{{ blue.total }}</span> kjøpt
      </div>
      <div>{{ blue.win }} vinn</div>
      <div>{{ bluePercentage }}% vinn</div>
    </div>
    <div class="yellow-container inner-bought-container">
      <div>
        <span class="yellow">{{ yellow.total }}</span> kjøpt
      </div>
      <div>{{ yellow.win }} vinn</div>
      <div>{{ yellowPercentage }}% vinn</div>
    </div>
    <div class="green-container inner-bought-container">
      <div>
        <span class="green">{{ green.total }}</span> kjøpt
      </div>
      <div>{{ green.win }} vinn</div>
      <div>{{ greenPercentage }}% vinn</div>
    </div>
    <!--<div class="total-container inner-bought-container">
      <div>
        totalt&nbsp;
        <span class="total">{{ total }}</span> kjøpt
      </div>
      <div>{{ totalWin }} vinn</div>
    </div>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      red: 0,
      blue: 0,
      yellow: 0,
      green: 0,
      total: 0,
      totalWin: 0,
      wins: 0,
      redPercentage: 0,
      yellowPercentage: 0,
      greenPercentage: 0,
      bluePercentage: 0
    };
  },
  async mounted() {
    let _response = await fetch("/api/purchase/statistics/color");
    let response = await _response.json();
    this.red = response.red;
    this.blue = response.blue;
    this.green = response.green;
    this.yellow = response.yellow;
    this.total = response.total;
    this.totalWin =
      this.red.win + this.yellow.win + this.blue.win + this.green.win;

    this.redPercentage = this.round(
      this.red.win == 0 ? 0 : (this.red.win / this.totalWin) * 100
    );
    this.greenPercentage = this.round(
      this.green.win == 0 ? 0 : (this.green.win / this.totalWin) * 100
    );
    this.bluePercentage = this.round(
      this.blue.win == 0 ? 0 : (this.blue.win / this.totalWin) * 100
    );
    this.yellowPercentage = this.round(
      this.yellow.win == 0 ? 0 : (this.yellow.win / this.totalWin) * 100
    );
  },
  methods: {
    round: function(number) {
      return Math.round(number * 100) / 100;
    }
  }
};
</script>

<style lang="scss" scoped>
.inner-bought-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bought-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  max-width: 1400px;
  margin: auto;
  justify-content: space-around;
  font-family: sans-serif;
}

.green,
.blue,
.yellow,
.red,
.total {
  font-size: 2rem;
  font-weight: bold;
}

.green {
  color: #10e783;
}

.red {
  color: #ef5878;
}

.yellow {
  color: #ffde5d;
}

.blue {
  color: #57d2fb;
}
</style>
