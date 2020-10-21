<template>
  <section class="outer-bought">
    <h3>Loddstatistikk</h3>

    <div class="total-ballots">
        Totalt&nbsp;
        <span class="total">{{ total }}</span>
        &nbsp;kjøpte og&nbsp;
        <span>{{ totalWin }}&nbsp;vinn</span>
    </div>


    <div class="bought-container">
      <div
        v-for="color in colors"
        :class="
          color.name +
            '-container ' +
            color.name +
            '-ballot ballot-element-local'
        "
        :key="color.name"
        >
        <p class="winner-chance">
          {{translate(color.name)}} vinnersjanse
        </p>
        <span class="win-percentage">{{ color.totalPercentage }}% </span>
        <p class="total-bought-color">{{ color.total }} kjøpte</p>
        <p class="amount-of-wins"> {{ color.win }} vinn </p>
      </div>
    </div>
  </section>
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
      stolen: 0,
      wins: 0,
      redPercentage: 0,
      yellowPercentage: 0,
      greenPercentage: 0,
      bluePercentage: 0,
    };
  },
  async mounted() {
    let response = await colorStatistics();

    this.red = response.red;
    this.blue = response.blue;
    this.green = response.green;
    this.yellow = response.yellow;
    this.total = response.total;

    this.totalWin =
      this.red.win + this.yellow.win + this.blue.win + this.green.win;
    this.stolen = response.stolen;

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

    this.colors.push({
      name: "red",
      total: this.red.total,
      win: this.red.win,
      totalPercentage: this.getPercentage(this.red.win, this.totalWin),
      percentage: this.getPercentage(this.red.win, this.red.total)
    });
    this.colors.push({
      name: "blue",
      total: this.blue.total,
      win: this.blue.win,
      totalPercentage: this.getPercentage(this.blue.win, this.totalWin),
      percentage: this.getPercentage(this.blue.win, this.blue.total)
    });
    this.colors.push({
      name: "yellow",
      total: this.yellow.total,
      win: this.yellow.win,
      totalPercentage: this.getPercentage(this.yellow.win, this.totalWin),
      percentage: this.getPercentage(this.yellow.win, this.yellow.total)
    });
    this.colors.push({
      name: "green",
      total: this.green.total,
      win: this.green.win,
      totalPercentage: this.getPercentage(this.green.win, this.totalWin),
      percentage: this.getPercentage(this.green.win, this.green.total)
    });

    this.colors = this.colors.sort((a, b) => (a.win > b.win ? -1 : 1));
  },
  methods: {
    translate(color){
      switch(color) {
        case "blue":
          return "Blå"
          break;
        case "red":
          return "Rød"
          break;
        case "green":
          return "Grønn"
          break;
        case "yellow":
          return "Gul"
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";
@import "../styles/global.scss";

@include mobile{
  section {
    margin-top: 5em;
  }
}

.total-ballots {
  display: flex;
}

.bought-container {
  margin-top: 2em;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 50px;

  .ballot-element-local {
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

      &.total-bought-color{
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

    &.green-ballot {
      background-color: $light-green;
    }

    &.blue-ballot {
      background-color: $light-blue;
    }

    &.yellow-ballot {
      background-color: $light-yellow;
    }

    &.red-ballot {
      background-color: $light-red;
    }
  }
}
</style>
