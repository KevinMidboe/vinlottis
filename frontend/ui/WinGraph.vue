<template>
  <div class="chart">
    <canvas ref="win-chart"></canvas>
  </div>
</template>

<script>
export default {
  methods: {
    fetchWinsByColor() {
      return fetch("/api/history/by-color").then(resp => resp.json());
    }
  },
  async mounted() {
    let canvas = this.$refs["win-chart"].getContext("2d");

    let response = await this.fetchWinsByColor();
    const { colors } = response;
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

    const findColorWinners = (colorSelect, colors) => {
      return colors.filter(color => color.color == colorSelect)[0].count;
    };

    const blueWinCount = findColorWinners("blue", colors);
    const redWinCount = findColorWinners("red", colors);
    const greenWinCount = findColorWinners("green", colors);
    const yellowWinCount = findColorWinners("yellow", colors);

    blue.data.push(blueWinCount);
    red.data.push(redWinCount);
    green.data.push(greenWinCount);
    yellow.data.push(yellowWinCount);

    let highestNumber = 0;
    [blueWinCount, redWinCount, greenWinCount, greenWinCount].forEach(winCount => {
      if (winCount > highestNumber) {
        highestNumber = winCount;
      }
    });

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
.chart {
  height: 40vh;
  max-height: 500px;
  width: 100%;
}
</style>
