<template>
  <div class="container">
    <banner />
    <h1>Loddgenerator</h1>
    <p>Velg hvilke farger du vil ha, fyll inn antall lodd og klikk 'generer'</p>
    <div class="input-line">
      <input
        type="number"
        placeholder="Antall lodd"
        @keyup.enter="generateColors"
        v-model="numberOfBallots"
      />
      <button @click="generateColors">Generer</button>
    </div>
    <!--<div class="colors-text">
      <p>Blå: {{ blue }}</p>
      <p>Rød: {{ red }}</p>
      <p>Grønn: {{ green }}</p>
      <p>Gul: {{ yellow }}</p>
    </div>-->
    <div class="colors">
      <div
        v-for="color in colors"
        :class="getColorClass(color)"
        class="color-box"
        :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
      ></div>
    </div>

    <img src="/public/assets/images/vipps.png" class="vipps-image" />
  </div>
</template>

<script>
import Banner from "@/ui/Banner";

export default {
  components: {
    Banner
  },
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
    getRotation: function() {
      let num = Math.floor(Math.random() * 15);
      let neg = Math.floor(Math.random() * 2);
      return neg == 0 ? -num : num;
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
body {
  margin: 0;
  color: #333333;
  font-family: Knowit;
  padding-bottom: 30px;
}
.header-link {
  color: #333333;
  text-decoration: none;
}
h1 {
  text-align: center;
}
h1 {
  width: 100vw;
  text-align: center;
  font-family: Knowit;
}

p {
  text-align: center;
  margin-bottom: 35px;
  margin-top: 0px;
}

.input-line {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.top-banner {
  margin-top: 0px;
  padding: 20px 0;
  background-color: #dbeede;
  box-shadow: 0 0 10px 0px #0000003a;
}

.vipps-image {
  width: 250px;
  margin: auto;
  display: block;
  margin-top: 30px;
}
input,
button {
  font-size: 1.5rem;
  font-family: "knowit";
}

input {
  font-size: 1.5rem;
  padding: 8px;
}
.container {
  font-family: Knowit;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1400px;
  margin: auto;
}
.color-box {
  width: 150px;
  height: 150px;
  margin: 20px;
}

button {
  border: none;
  background: #b7debd;
  color: #333333;
  padding: 10px 30px;
  width: fit-content;
  margin: auto;
  font-size: 1.3rem;
  height: 48px;
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.green {
  background-color: #c8f9df;
}

.red {
  background-color: #fbd7de;
}

.yellow {
  background-color: #fff6d6;
}

.blue {
  background-color: #d4f2fe;
}

@media only screen and (max-width: 768px) {
  input {
    border: 1px solid #333333;
  }
  input,
  button {
    font-size: 1rem;
  }

  button {
    height: calc(2rem + 6px);
  }

  p {
    padding: 0 15px;
  }
}
</style>
