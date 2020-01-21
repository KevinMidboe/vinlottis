<template>
  <div>
    <canvas ref="win-chart" width="100" height="50"></canvas>
  </div>
</template>

<script>
export default {
  async mounted() {
    let canvas = this.$refs["win-chart"].getContext("2d");

    console.log(canvas);
    let _response = await fetch("/api/purchase/statistics/color");
    let response = await _response.json();
    let labels = ["Vunnet"];
    let blue = {
      label: "Blå",
      borderColor: "#57d2fb",
      backgroundColor: "#fbd7de10",
      data: []
    };
    let yellow = {
      label: "Gul",
      borderColor: "#ffde5d",
      backgroundColor: "#fff6d610",
      data: []
    };
    let red = {
      label: "Rød",
      borderColor: "#ef5878",
      backgroundColor: "#fbd7de10",
      data: []
    };
    let green = {
      label: "Grønn",
      borderColor: "#10e783",
      backgroundColor: "#c8f9df10",
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
        title: {
          display: true,
          text: "Antall vinn"
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
