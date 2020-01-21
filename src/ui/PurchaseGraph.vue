<template>
  <div>
    <canvas ref="purchase-chart" width="100" height="50"></canvas>
  </div>
</template>

<script>
import Chartjs from "chart.js";

export default {
  async mounted() {
    let canvas = this.$refs["purchase-chart"].getContext("2d");

    console.log(canvas);
    let _response = await fetch("/api/purchase/statistics");
    let response = await _response.json();
    let labels = [];
    let blue = {
      label: "Blå",
      borderColor: "#4bcffa",
      backgroundColor: "#4bcffa10",
      data: []
    };
    let yellow = {
      label: "Gul",
      borderColor: "#ffdd59",
      backgroundColor: "#ffdd5910",
      data: []
    };
    let red = {
      label: "Rød",
      borderColor: "#ef5777",
      backgroundColor: "#ef577710",
      data: []
    };
    let green = {
      label: "Grønn",
      borderColor: "#0be881",
      backgroundColor: "#0be88110",
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
  },
  methods: {
    getPrettierDateString(date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }
  }
};
</script>

<style lang="scss" scoped></style>
