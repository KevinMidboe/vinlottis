<template>
  <div class="container">
    <h1 class="title">Loddgenerator</h1>
    <p class="subtext">Velg hvilke farger du vil ha, fyll inn antall lodd og klikk 'generer'</p>
    <div class="input-line">
      <label for="redCheckbox">
        <input type="checkbox" id="redCheckbox" v-model="redCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Rød</span>
      </label>
      <label for="blueCheckbox">
        <input type="checkbox" id="blueCheckbox" v-model="blueCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Blå</span>
      </label>
      <label for="yellowCheckbox">
        <input type="checkbox" id="yellowCheckbox" v-model="yellowCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Gul</span>
      </label>
      <label for="greenCheckbox">
        <input type="checkbox" id="greenCheckbox" v-model="greenCheckbox" />
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Grønn</span>
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
  margin-top: 3.8rem;
  font-weight: 600;
}

.subtext {
  margin-top: 0.50rem;
  font-size: 1.22rem;
}

p {
  text-align: center;
  margin: 0;
}

.input-line {
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2.4rem;
}

.input-line label {
  padding: 0 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-size: 1.22rem;
  margin: 0 0.6rem;
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
  height: 3rem;
  max-height: 3rem;
  border: 1px solid rgba(#333333, 0.3);
}

input[type="checkbox"] {
  display: none;
}

label .border {
  border: 1px solid rgba(#333333, 0.3);
  border-spacing: 2px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
}

label .checkmark {
  background: none;
  display: inline-block;
  width: 16px;
  height: 16px;
  padding: 2px;
}

label .text {
  margin-left: 0.15rem;
  margin-top: auto;
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
  height: 3rem;
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.green,
.input-line label input#greenCheckbox:checked ~ .border .checkmark {
  background-color: #c8f9df;
}

.input-line label:hover input#greenCheckbox ~ .border .checkmark {
  background-color: #10e783;
}

.input-line label:focus input#greenCheckbox ~ .border .checkmark,
.input-line label:active input#greenCheckbox ~ .border .checkmark {
  background-color: #0ed277;
}

.red,
.input-line label input#redCheckbox:checked ~ .border .checkmark {
  background-color: #fbd7de;
}

.input-line label:hover input#redCheckbox ~ .border .checkmark {
  background-color: #ef5878;
}

.input-line label:focus input#redCheckbox ~ .border .checkmark,
.input-line label:active input#redCheckbox ~ .border .checkmark {
  background-color: #ec3b61;
}

.yellow,
.input-line label input#yellowCheckbox:checked ~ .border .checkmark {
  background-color: #fff6d6;
}

.input-line label:hover input#yellowCheckbox ~ .border .checkmark {
  background-color: #ffde5d;
}
.input-line label:focus input#yellowCheckbox ~ .border .checkmark,
.input-line label:active input#yellowCheckbox ~ .border .checkmark {
  background-color: #ecc31d;
}

.blue,
.input-line label input#blueCheckbox:checked ~ .border .checkmark {
  background-color: #d4f2fe;
}
.input-line label:hover input#blueCheckbox ~ .border .checkmark {
  background-color: #57d2fb;
}

.input-line label:focus input#blueCheckbox ~ .border .checkmark,
.input-line label:active input#blueCheckbox ~ .border .checkmark {
  background-color: #24acda;
}

@media only screen and (max-width: 768px) {
  input,
  button {
    font-size: 1.4rem;
    line-height: 1.4rem;
  }

  input {
    width: 45vw;
    height: 3rem;
  }

  p {
    padding: 0 15px;
  }
}
</style>
