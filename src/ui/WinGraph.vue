<template>
  <div class="chart">
    <canvas ref="win-chart"></canvas>
  </div>
</template>

<script>
export default {
  async mounted() {
    let canvas = this.$refs["win-chart"].getContext("2d");

    let _response = undefined;
    if (process.env.NODE_ENV == "development") {
      _response = await fetch(
        "http://localhost:30030/api/purchase/statistics/color"
      );
    } else {
      _response = await fetch("/api/purchase/statistics/color");
    }
    let response = await _response.json();
    let labels = ["Vunnet"];
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
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Antall vinn"
        },
        legend: {
          labels: {
            // This more specific font property overrides the global property
            defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
              "'knowit'")
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

  @include mobile {
    position: relative;
    width: 90vw !important;
    height: 50vh;
    margin-bottom: 2rem;
  }
}
</style>
