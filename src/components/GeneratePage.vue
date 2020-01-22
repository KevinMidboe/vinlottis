<template>
  <div class="container">
    <banner />

    <h1 class="title">Loddgenerator</h1>
    <p>Velg hvilke farger du vil ha, fyll inn antall lodd og klikk 'generer'</p>
    <div class="input-line">
      <label for="redCheckbox">
        <input type="checkbox" id="redCheckbox" v-model="redCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        Rød
      </label>
      <label for="yellowCheckbox">
        <input type="checkbox" id="yellowCheckbox" v-model="yellowCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        Gul
      </label>
      <label for="blueCheckbox">
        <input type="checkbox" id="blueCheckbox" v-model="blueCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        Blå
      </label>
      <label for="greenCheckbox">
        <input type="checkbox" id="greenCheckbox" v-model="greenCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        Grønn
      </label>
    </div>
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
      numberOfBallots: 4,
      colors: [],
      blue: 0,
      red: 0,
      green: 0,
      yellow: 0,
      colorTimeout: null,
      redCheckbox: true,
      greenCheckbox: true,
      yellowCheckbox: true,
      blueCheckbox: true
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
      let randomArray = [];
      if (this.redCheckbox) {
        randomArray.push(1);
      }
      if (this.greenCheckbox) {
        randomArray.push(2);
      }
      if (this.yellowCheckbox) {
        randomArray.push(3);
      }
      if (this.blueCheckbox) {
        randomArray.push(4);
      }
      if (randomArray.length == 0) {
        alert("Du må velge MINST 1 farge..");
        return;
      }
      if (this.numberOfBallots > 0) {
        for (let i = 0; i < this.numberOfBallots; i++) {
          let color =
            randomArray[Math.floor(Math.random() * randomArray.length)];
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
  width: 100vw;
  text-align: center;
  font-family: Knowit;
}

.title {
  margin-top: 4rem;
}

p {
  text-align: center;
  margin-bottom: 15px;
  margin-top: 0px;
}

.input-line {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}

.input-line label {
  padding: 0 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
  margin: 0;
  max-height: 3rem;
}

input[type="checkbox"] {
  display: none;
}

label .border {
  border: 1px solid #333333;
  border-spacing: 2px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
}

label .checkmark {
  background: none;
  display: inline-block;
  width: 12px;
  height: 12px;
  padding: 2px;
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
  -webkit-mask-image: url(/../../public/assets/images/lodd.svg);
  background-repeat: no-repeat;
  mask-image: url(/../../public/assets/images/lodd.svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

button {
  border: none;
  background: #b7debd;
  color: #333333;
  padding: 10px 30px;
  width: fit-content;
  margin: 0;
  font-size: 1.3rem;
  height: calc(3rem + 1.8px);
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.green,
.input-line label:hover input#greenCheckbox ~ .border .checkmark,
.input-line label input#greenCheckbox:checked ~ .border .checkmark {
  background-color: #c8f9df;
}

.red,
.input-line label:hover input#redCheckbox ~ .border .checkmark,
.input-line label input#redCheckbox:checked ~ .border .checkmark {
  background-color: #fbd7de;
}

.yellow,
.input-line label:hover input#yellowCheckbox ~ .border .checkmark,
.input-line label input#yellowCheckbox:checked ~ .border .checkmark {
  background-color: #fff6d6;
}

.blue,
.input-line label:hover input#blueCheckbox ~ .border .checkmark,
.input-line label input#blueCheckbox:checked ~ .border .checkmark {
  background-color: #d4f2fe;
}

@media only screen and (max-width: 768px) {
  input,
  button {
    font-size: 1.3rem;
  }

  input {
    width: 45vw;
  }

  p {
    padding: 0 15px;
  }
}
</style>
