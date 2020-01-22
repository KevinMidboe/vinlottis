<template>
  <div class="bought-container">
    <div class="red-container inner-bought-container">
      <div class="number-container">
        <span class="red bought-number-span">{{ red.total }}</span>
        <div class="inner-text-container">
          <span> kjøpte</span>
          <div>{{ red.win }} vinn</div>
          <div>{{ redPercentage }}% vinn</div>
        </div>
      </div>
    </div>
    <div class="blue-container inner-bought-container">
      <div class="number-container">
        <span class="blue bought-number-span">{{ blue.total }}</span>
        <div class="inner-text-container">
          <span> kjøpte</span>
          <div>{{ blue.win }} vinn</div>
          <div>{{ bluePercentage }}% vinn</div>
        </div>
      </div>
    </div>
    <div class="yellow-container inner-bought-container">
      <div class="number-container">
        <span class="yellow bought-number-span">{{ yellow.total }}</span>
        <div class="inner-text-container">
          <span> kjøpte</span>
          <div>{{ yellow.win }} vinn</div>
          <div>{{ yellowPercentage }}% vinn</div>
        </div>
      </div>
    </div>
    <div class="green-container inner-bought-container">
      <div class="number-container">
        <span class="green bought-number-span">{{ green.total }}</span>
        <div class="inner-text-container">
          <span> kjøpte</span>
          <div>{{ green.win }} vinn</div>
          <div>{{ greenPercentage }}% vinn</div>
        </div>
      </div>
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

.number-container {
  display: flex;
}

.inner-text-container {
  margin-top: 0.8rem;
  padding-left: 5px;
}

.bought-number-span {
  display: inline-flex;
}

.bought-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  max-width: 1400px;
  margin: auto;
  justify-content: space-around;
  font-family: "knowit";
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
