<template>
  <div>
    <canvas ref="purchase-chart" width="100" height="50"></canvas>
    <div ref="chartjsLegend" class="chartjsLegend"></div>
  </div>
</template>

<script>
import Chartjs from "chart.js";

export default {
  async mounted() {
    let canvas = this.$refs["purchase-chart"].getContext("2d");

    let _response = await fetch("/api/purchase/statistics");
    let response = await _response.json();
    let labels = [];
    let blue = {
      label: "Blå",
      borderColor: "#57d2fb",
      backgroundColor: "#d4f2fe",
      data: []
    };
    let yellow = {
      label: "Gul",
      borderColor: "#ffde5d",
      backgroundColor: "#fff6d6",
      data: []
    };
    let red = {
      label: "Rød",
      borderColor: "#ef5878",
      backgroundColor: "#fbd7de",
      data: []
    };
    let green = {
      label: "Grønn",
      borderColor: "#10e783",
      backgroundColor: "#c8f9df",
      data: []
    };

    let highestNumber = 0;

    for (let i = 0; i < response.length; i++) {
      let thisDate = response[i];
      let dateObject = new Date(thisDate.date);
      labels.push(this.getPrettierDateString(dateObject));

      blue.data.push(thisDate.blue);
      yellow.data.push(thisDate.yellow);
      red.data.push(thisDate.red);
      green.data.push(thisDate.green);

      if (thisDate.blue > highestNumber) {
        highestNumber = thisDate.blue;
      }
      if (thisDate.yellow > highestNumber) {
        highestNumber = thisDate.yellow;
      }
      if (thisDate.green > highestNumber) {
        highestNumber = thisDate.green;
      }
      if (thisDate.red > highestNumber) {
        highestNumber = thisDate.red;
      }
    }
    let datasets = [blue, yellow, green, red];
    let chartdata = {
      labels: labels,
      datasets: datasets
    };
    let chart = new Chart(canvas, {
      type: "line",
      data: chartdata,
      options: {
        title: {
          display: true,
          text: "Antall kjøp"
        },
        legend: {
          display: true,
          boxWidth: 3,
          usePointStyle: true,
          borderRadius: 10,
          labels: {
            // This more specific font property overrides the global property
            defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
              "'knowit'")
          }
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                suggestedMax: highestNumber + 5
              }
            }
          ]
        }
      }
    });
  },
  methods: {
    getPrettierDateString(date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.chartjsLegend li span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 25px;
}
</style>
