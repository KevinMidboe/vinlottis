<template>
  <div class="container">
    <h2>What to buy?</h2>
    <input
      type="number"
      placeholder="Antall lodd"
      @keyup.enter="generateColors"
      v-model="numberOfBallots"
    />
    <button @click="generateColors">Generer</button>
    <div class="colors-text">
      <p>Blå: {{ blue }}</p>
      <p>Rød: {{ red }}</p>
      <p>Grønn: {{ green }}</p>
      <p>Gul: {{ yellow }}</p>
    </div>
    <div class="colors">
      <div
        v-for="color in colors"
        :class="getColorClass(color)"
        class="color-box"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numberOfBallots: 0,
      colors: [],
      blue: 0,
      red: 0,
      green: 0,
      yellow: 0,
      colorTimeout: null
    };
  },
  methods: {
    generateColors: function(event, time) {
      if (time == 5) {
        return;
      }
      if (time == undefined) {
        time = 1;
      }
      this.colors = [];
      this.blue = 0;
      this.red = 0;
      this.green = 0;
      this.yellow = 0;
      if (this.numberOfBallots > 0) {
        for (let i = 0; i < this.numberOfBallots; i++) {
          let color = Math.floor(Math.random() * 4) + 1;
          this.colors.push(color);
          if (color == 1) {
            this.red += 1;
          }
          if (color == 2) {
            this.green += 1;
          }
          if (color == 3) {
            this.yellow += 1;
          }
          if (color == 4) {
            this.blue += 1;
          }
        }
      }
      clearTimeout(this.colorTimeout);
      this.colorTimeout = setTimeout(() => {
        this.generateColors(event, time + 1);
      }, 50);
    },
    getColorClass: function(number) {
      if (number == 1) {
        return "red";
      }
      if (number == 2) {
        return "green";
      }
      if (number == 3) {
        return "yellow";
      }
      if (number == 4) {
        return "blue";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
input,
button {
  margin: 10px;
  font-size: 1.5rem;
}
.container {
  font-family: sans-serif;
  width: 80vw;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.color-box {
  width: 150px;
  height: 150px;
  margin: 10px;
}

button {
  border: none;
  background: orange;
  color: white;
  padding: 10px;
  width: fit-content;
  margin: auto;
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.green {
  background-color: #0be881;
}

.red {
  background-color: #ef5777;
}

.yellow {
  background-color: #ffdd59;
}

.blue {
  background-color: #4bcffa;
}
</style>
