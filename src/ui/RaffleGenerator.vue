<template>
  <div class="container">
    <div class="input-line">
      <label for="redCheckbox">
        <input type="checkbox" id="redCheckbox" v-model="redCheckbox" @click="generateColors"/>
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Rød</span>
      </label>
      <label for="blueCheckbox">
        <input type="checkbox" id="blueCheckbox" v-model="blueCheckbox" @click="generateColors"/>
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Blå</span>
      </label>
      <label for="yellowCheckbox">
        <input type="checkbox" id="yellowCheckbox" v-model="yellowCheckbox" @click="generateColors"/>
        <span class="border">
          <span class="checkmark"></span>
        </span>
        <span class="text">Gul</span>
      </label>
      <label for="greenCheckbox">
        <input type="checkbox" id="greenCheckbox" v-model="greenCheckbox" @click="generateColors"/>
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
        v-model="numberOfRaffles"
      />
      <button class="vin-button" @click="generateColors">Generer</button>
    </div>
    <div class="colors">
      <div
        v-for="color in colors"
        :class="getColorClass(color)"
        class="color-box"
        :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
      ></div>
    </div>

    <div class="color-count-container" v-if="generated">
      <span>Rød: {{ red }}</span>
      <span>Blå: {{ blue }}</span>
      <span>Gul: {{ yellow }}</span>
      <span>Grønn: {{ green }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    generateOnInit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      numberOfRaffles: 4,
      colors: [],
      blue: 0,
      red: 0,
      green: 0,
      yellow: 0,
      colorTimeout: null,
      redCheckbox: true,
      greenCheckbox: true,
      yellowCheckbox: true,
      blueCheckbox: true,
      generated: false,
      generating: false
    };
  },
  beforeMount() {
    this.$emit("numberOfRaffles", this.numberOfRaffles);
    if (this.generateOnInit) {
      this.generateColors();
    }
  },
  watch: {
    numberOfRaffles: function() {
      this.$emit("numberOfRaffles", this.numberOfRaffles);
      this.generateColors();
    }
  },
  methods: {
    generateColors: function(event, time) {
      this.generating = true;
      if (time == 5) {
        this.generating = false;
        this.generated = true;
        if (this.numberOfRaffles > 1 &&
          [this.redCheckbox, this.greenCheckbox, this.yellowCheckbox, this.blueCheckbox].filter(value => value == true).length == 1) {
          return
        }

        if (new Set(this.colors).size == 1) {
          alert("BINGO");
        }

        this.emitColors()

        if (window.location.hostname == "localhost") {
          return;
        }
        this.$ga.event({
          eventCategory: "Raffles",
          eventAction: "Generate",
          eventValue: JSON.stringify(this.colors)
        });
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
        alert("Du må velge MINST 1 farge");
        return;
      }
      if (this.numberOfRaffles > 0) {
        for (let i = 0; i < this.numberOfRaffles; i++) {
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
    },
    emitColors() {
      this.$emit("colors", {
        blue: this.blue,
        red: this.red,
        green: this.green,
        yellow: this.yellow
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.container {
  margin: auto;
  display: flex;
  flex-direction: column;
}

.input-line {
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2.4rem;

  @include mobile {
    margin-top: 1.2rem;
  }
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

input,
button {
  font-size: 1.5rem;
}

input {
  font-size: 1.5rem;
  padding: 7px;
  margin: 0;
  height: 3rem;
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

.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1400px;
  margin: 3rem auto 0;

  @include mobile {
    margin: 1.8rem auto 0;
  }
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

  @include mobile {
    width: 60px;
    height: 60px;
    margin: 10px;
  }
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.color-count-container {
  margin: auto;
  width: 300px;
  justify-content: space-around;
  align-items: center;
  display: flex;
  font-family: Arial;
  margin-top: 35px;

  @include mobile {
    width: 80vw;
  }
}

.green {
  background-color: $light-green;
}

.blue {
  background-color: $light-blue;
}

.yellow {
  background-color: $light-yellow;
}

.red {
  background-color: $light-red;
}

.input-line label {
  & input {
    &#greenCheckbox:checked ~ .border .checkmark {
      background-color: $light-green;
    }

    &#redCheckbox:checked ~ .border .checkmark {
      background-color: $light-red;
    }

    &#yellowCheckbox:checked ~ .border .checkmark {
      background-color: $light-yellow;
    }

    &#blueCheckbox:checked ~ .border .checkmark {
      background-color: $light-blue;
    }
  }

  @include desktop {
    &:hover input {
      &#greenCheckbox ~ .border .checkmark {
        background-color: $green;
      }

      &#redCheckbox ~ .border .checkmark {
        background-color: $red;
      }

      &#yellowCheckbox ~ .border .checkmark {
        background-color: $yellow;
      }

      &#blueCheckbox ~ .border .checkmark {
        background-color: $blue;
      }
    }

    &:focus input,
    &:active input {
      &#greenCheckbox ~ .border .checkmark {
        background-color: $dark-green;
      }

      &#redCheckbox ~ .border .checkmark {
        background-color: $dark-red;
      }

      &#yellowCheckbox ~ .border .checkmark {
        background-color: $dark-yellow;
      }

      &#blueCheckbox ~ .border .checkmark {
        background-color: $dark-blue;
      }
    }
  }
}

@include mobile {
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

  .input-line {
    flex-wrap: wrap;

    label {
      width: 30%;
      margin-top: 15px;
      justify-content: flex-start;
    }
  }
}
</style>
