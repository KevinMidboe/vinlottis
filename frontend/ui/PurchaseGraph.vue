<template>
  <div class="chart">
    <canvas ref="purchase-chart" width="100" height="50"></canvas>
    <div ref="chartjsLegend" class="chartjsLegend"></div>
    <div class="year-select" v-if="years.length">
      <button
        class="vin-button small"
        v-for="year in years"
        :class="{ active: yearSelected == year }"
        @click="yearFilterClicked(year)"
      >
        {{ year }}
      </button>
    </div>
  </div>
</template>

<script>
import Chartjs from "chart.js";

export default {
  data() {
    return {
      lotteries: [],
      years: [],
      yearSelected: undefined,
      chart: undefined
    };
  },
  async mounted() {
    let canvas = this.$refs["purchase-chart"].getContext("2d");

    this.lotteries = await this.chartPurchaseByColor();
    if (this.lotteries?.length) this.years = [...new Set(this.lotteries.map(lot => lot.date.slice(0, 4)))];

    const dataset = this.calculateChartDatapoints();

    let chartData = {
      labels: dataset.labels,
      datasets: [dataset.blue, dataset.green, dataset.red, dataset.yellow]
    };

    this.chart = new Chart(canvas, {
      type: "line",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: 0 // general animation time
        },
        title: {
          display: true,
          text: "Antall kjøpt",
          fontSize: 20
        },
        legend: {
          display: true,
          boxWidth: 3,
          usePointStyle: true,
          borderRadius: 10,
          labels: {
            padding: 12,
            boxWidth: 20,
            usePointStyle: true
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  },
  methods: {
    async yearFilterClicked(year) {
      this.yearSelected = this.yearSelected === year ? null : year;

      this.lotteries = await this.chartPurchaseByColor();
      const dataset = this.calculateChartDatapoints();
      let chartData = {
        labels: dataset.labels,
        datasets: [dataset.blue, dataset.green, dataset.red, dataset.yellow]
      };

      this.chart.data = chartData;
      this.chart.update();
    },
    setupDataset() {
      let blue = {
        label: "Blå",
        borderColor: "#57d2fb",
        backgroundColor: "#d4f2fe",
        borderWidth: 2,
        data: []
      };
      let yellow = {
        label: "Gul",
        borderColor: "#ffde5d",
        backgroundColor: "#fff6d6",
        borderWidth: 2,
        data: []
      };
      let red = {
        label: "Rød",
        borderColor: "#ef5878",
        backgroundColor: "#fbd7de",
        borderWidth: 2,
        data: []
      };
      let green = {
        label: "Grønn",
        borderColor: "#10e783",
        backgroundColor: "#c8f9df",
        borderWidth: 2,
        data: []
      };

      return {
        labels: [""],
        blue,
        green,
        red,
        yellow
      };
    },
    calculateChartDatapoints() {
      let dataset = this.setupDataset();

      this.lotteries.map(lottery => {
        const date = new Date(lottery.date);
        dataset.labels.push(this.getPrettierDateString(date));

        dataset.blue.data.push(lottery.blue);
        dataset.green.data.push(lottery.green);
        dataset.red.data.push(lottery.red);
        dataset.yellow.data.push(lottery.yellow);
      });

      return dataset;
    },
    chartPurchaseByColor() {
      const url = new URL("/api/lotteries", window.location);
      if (this.yearSelected != null) url.searchParams.set("year", this.yearSelected);

      return fetch(url.href)
        .then(resp => resp.json())
        .then(response => response.lotteries);
    },
    getPrettierDateString(date) {
      return `${this.pad(date.getDate())}.${this.pad(date.getMonth() + 1)}.${this.pad(date.getYear() - 100)}`;
    },
    pad(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries.scss";

.chart {
  height: 40vh;
  max-height: 500px;
  width: 100%;
}

.year-select {
  margin-top: 1rem;

  button:not(:first-of-type) {
    margin-left: 0.5rem;
  }
}
</style>
