<template>
  <div class="outer-bought">
    <h3>Loddstatistikk</h3>
    <div class="bought-container">
      <div
        v-for="color in colors"
        :class="
          color.name +
            '-container ' +
            color.name +
            '-raffle inner-bought-container raffle-element'
        "
        :key="color.name"
      >
        <div class="number-container">
          <span class="color-total bought-number-span">
            {{ color.total }}
          </span>
          <span>kjøpte</span>
        </div>
        <div class="inner-text-container">
          <div>{{ color.win }} vinn</div>
          <div>{{ color.totalPercentage }}% vinn</div>
        </div>
      </div>

      <div class="inner-bought-container total-raffles">
        <div class="total-container">
          Totalt&nbsp;
          <div>
            <span class="total">{{ total }}</span> kjøpte
          </div>
          <div>{{ totalWin }} vinn</div>
          <div>{{ stolen }} stjålet</div>
        </div>
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
      stolen: 0,
      wins: 0,
      redPercentage: 0,
      yellowPercentage: 0,
      greenPercentage: 0,
      bluePercentage: 0
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
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

.inner-bought-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.raffle-element {
  width: 140px;
  height: 150px;
  margin: 20px 0;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // TODO fix styling for displaying in columns
  @include mobile {
    & div {
      padding: 0 5px;
    }
  }
}

.total-raffles {
  width: 150px;
  height: 150px;
  margin: 20px 0;
}

.total-container {
  align-items: flex-start;
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

.outer-bought {
  @include mobile {
    padding: 0 20px;
  }
}

.bought-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

.color-total,
.total {
  font-size: 2rem;
  font-weight: bold;
}

.small {
  font-weight: bold;
  font-size: 1.25rem;
  display: inline-block;
}

@include mobile {
  .bought-container {
    flex-wrap: wrap;
  }
}
</style>
