<template>
  <div>
    <h3>Loddstatistikk</h3>

    <div class="total-raffles">
      Totalt&nbsp;
      <span class="total">{{ total }}</span>
      &nbsp;kjøpte,&nbsp;
      <span>{{ totalWin }}&nbsp;vinn og&nbsp;</span>
      <span> {{ stolen }} stjålet </span>
    </div>

    <div class="bought-container">
      <div
        v-for="color in colors"
        :class="color.name + '-container ' + color.name + '-raffle raffle-element-local'"
        :key="color.name"
      >
        <p class="winner-chance">{{ translate(color.name) }} vinnersjanse</p>
        <span class="win-percentage">{{ color.totalPercentage }}% </span>
        <p class="total-bought-color">{{ color.total }} kjøpte</p>
        <p class="amount-of-wins">{{ color.win }} vinn</p>
      </div>
    </div>
  </div>
</template>

<script>
import { colorStatistics } from "@/api";

export default {
  data() {
    return {
      colors: [],
      red: 0,
      blue: 0,
      yellow: 0,
      green: 0,
      total: 0,
      totalWin: 0,
      stolen: 0
    };
  },
  async mounted() {
    this.allLotteries().then(this.computeColors);
  },
  methods: {
    allLotteries() {
      return fetch("/api/lotteries?includeWinners=true")
        .then(resp => resp.json())
        .then(response => response.lotteries);
    },
    translate(color) {
      switch (color) {
        case "blue":
          return "Blå";
          break;
        case "red":
          return "Rød";
          break;
        case "green":
          return "Grønn";
          break;
        case "yellow":
          return "Gul";
          break;
          break;
      }
    },
    getPercentage: function(win, total) {
      return this.round(win == 0 ? 0 : (win / total) * 100);
    },
    round: function(number) {
      //this can make the odds added together more than 100%, maybe rework?
      let actualPercentage = Math.round(number * 100) / 100;
      let rounded = actualPercentage.toFixed(0);
      return rounded;
    },
    computeColors(lotteries) {
      let totalRed = 0;
      let totalGreen = 0;
      let totalYellow = 0;
      let totalBlue = 0;
      let total = 0;
      let stolen = 0;

      const colorAccumulatedWins = {
        blue: 0,
        green: 0,
        red: 0,
        yellow: 0
      };

      const accumelatedColors = (winners, colorAccumulatedWins) => {
        winners.forEach(winner => {
          const winnerColor = winner.color;
          colorAccumulatedWins[winnerColor] += 1;
        });
      };

      lotteries.forEach(lottery => {
        totalRed += lottery.red;
        totalGreen += lottery.green;
        totalYellow += lottery.yellow;
        totalBlue += lottery.blue;
        total += lottery.bought;
        stolen += lottery.stolen;

        accumelatedColors(lottery.winners, colorAccumulatedWins);
      });

      this.red = totalRed;
      this.yellow = totalYellow;
      this.green = totalGreen;
      this.blue = totalBlue;
      this.total = total;

      this.totalWin =
        colorAccumulatedWins.red + colorAccumulatedWins.yellow + colorAccumulatedWins.blue + colorAccumulatedWins.green;
      this.stolen = stolen;

      this.colors.push({
        name: "red",
        total: totalRed,
        win: colorAccumulatedWins.red,
        totalPercentage: this.getPercentage(colorAccumulatedWins.red, this.totalWin),
        percentage: this.getPercentage(colorAccumulatedWins.red, this.red.total)
      });
      this.colors.push({
        name: "blue",
        total: totalBlue,
        win: colorAccumulatedWins.blue,
        totalPercentage: this.getPercentage(colorAccumulatedWins.blue, this.totalWin),
        percentage: this.getPercentage(colorAccumulatedWins.blue, this.blue.total)
      });
      this.colors.push({
        name: "yellow",
        total: totalYellow,
        win: colorAccumulatedWins.yellow,
        totalPercentage: this.getPercentage(colorAccumulatedWins.yellow, this.totalWin),
        percentage: this.getPercentage(colorAccumulatedWins.yellow, this.yellow.total)
      });
      this.colors.push({
        name: "green",
        total: totalGreen,
        win: colorAccumulatedWins.green,
        totalPercentage: this.getPercentage(colorAccumulatedWins.green, this.totalWin),
        percentage: this.getPercentage(colorAccumulatedWins.green, this.green.total)
      });

      this.colors = this.colors.sort((a, b) => (a.win > b.win ? -1 : 1));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/media-queries.scss";
@import "@/styles/global.scss";

@include mobile {
  section {
    margin-top: 5em;
  }
}

.total-raffles {
  display: flex;
}

.bought-container {
  margin-top: 2em;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 50px;

  .raffle-element-local {
    height: 250px;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    @include raffle;

    .win-percentage {
      margin-left: 30px;
      font-size: 50px;
    }

    p {
      margin-left: 30px;
      &.winner-chance {
        margin-top: 40px;
      }

      &.total-bought-color {
        font-weight: bold;
        margin-top: 25px;
      }

      &.amount-of-wins {
        font-weight: bold;
      }
    }

    h3 {
      margin-left: 15px;
    }

    &.green-raffle {
      background-color: $light-green;
    }

    &.blue-raffle {
      background-color: $light-blue;
    }

    &.yellow-raffle {
      background-color: $light-yellow;
    }

    &.red-raffle {
      background-color: $light-red;
    }
  }
}
</style>
