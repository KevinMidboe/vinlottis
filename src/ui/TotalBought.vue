<template>
  <div class="outer-bought">
    <h3>Loddstatistikk</h3>
    <div class="bought-container">
      <div
        v-for="color in colors"
        :class="color.name + '-container inner-bought-container'"
        :key="color.name"
      >
        <div class="number-container">
          <span :class="color.name + ' bought-number-span'">{{
            color.total
          }}</span>
          <span> kjøpte</span>
        </div>
        <div class="inner-text-container">
          <div>
            {{ color.win }} vinn -
            <span class="small">{{ color.totalPercentage }}</span
            >%
          </div>
          <div>
            <span :class="color.name + ' small'">{{ color.percentage }}</span
            >% vinn
          </div>
        </div>
      </div>

      <div class="total-container inner-bought-container">
        <div>
          Totalt&nbsp;
          <span class="total">{{ total }}</span> kjøpt
        </div>
        <div>{{ totalWin }} vinn</div>
      </div>
    </div>
  </div>
</template>
<script>
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
    getPercentage: function(win, total) {
      return this.round(win == 0 ? 0 : (win / total) * 100);
    },
    round: function(number) {
      return Math.round(number * 100) / 100;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

.inner-bought-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @include mobile {
    flex-direction: row;
    justify-content: unset;
    align-items: center;
  }
}

.number-container {
  display: flex;
  align-items: flex-end;

  & span:last-child {
    padding-bottom: 5px;
    padding-left: 5px;
  }
}

.inner-text-container {
  padding-left: 5px;

  // TODO fix styling for displaying in columns
  @include mobile {
    margin-top: auto;
    padding-bottom: 5px;
  }
}

@include mobile {
  .total-container {
    > div:nth-of-type(2) {
      margin-top: auto;
      padding-bottom: 4px;
      padding-left: 5px;
    }
  }
}

.bought-number-span {
  display: inline-flex;
}

.bought-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-bottom: 3rem;
  max-width: 1400px;
  margin: auto;
  justify-content: space-between;
  font-family: Arial;

  @include mobile {
    padding-bottom: 0px;
  }
}

.green,
.blue,
.yellow,
.red,
.total {
  font-size: 2rem;
  font-weight: bold;
}

.small {
  font-weight: bold;
  font-size: 1.25rem;
  display: inline-block;
}

.green {
  color: $green;
}

.red {
  color: $red;
}

.yellow {
  color: $yellow;
}

.blue {
  color: $blue;
}

@include mobile {
  .bought-container {
    flex-wrap: wrap;
    flex-direction: column;
  }
}
</style>
