<template>
  <div class="chart">
    <canvas ref="win-chart"></canvas>
  </div>
</template>

<script>
import { chartWinsByColor } from "@/api";

export default {
  async mounted() {
    let canvas = this.$refs["win-chart"].getContext("2d");

    let response = await chartWinsByColor();
    let labels = ["Vunnet"];
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

    blue.data.push(response.blue.win);
    yellow.data.push(response.yellow.win);
    red.data.push(response.red.win);
    green.data.push(response.green.win);
    let highestNumber = 0;
    if (response.blue.win > highestNumber) {
      highestNumber = response.blue.win;
    }
    if (response.red.win > highestNumber) {
      highestNumber = response.red.win;
    }
    if (response.green.win > highestNumber) {
      highestNumber = response.green.win;
    }
    if (response.yellow.win > highestNumber) {
      highestNumber = response.yellow.win;
    }

    let datasets = [blue, yellow, green, red];
    let chartdata = {
      labels: labels,
      datasets: datasets
    };
    let chart = new Chart(canvas, {
      type: "bar",
      data: chartdata,
      options: {
        animation: {
          duration: 0 // general animation time
        },
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Antall vinn",
          fontSize: 20
        },
        legend: {
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
                beginAtZero: true,
                suggestedMax: highestNumber + 5
              }
            }
          ]
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";

.chart {
  height: 40vh;
  max-height: 500px;
  width: 100%;
}
</style>
