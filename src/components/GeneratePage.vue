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

    <div class="colors">
      <div
        v-for="color in colors"
        :class="getColorClass(color)"
        class="color-box"
        :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
      ></div>
    </div>

    <Vipps class="vipps" />
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import Vipps from "@/ui/Vipps";
import Banner from "@/ui/Banner";

export default {
  components: {
    Banner,
    Vipps
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
  watch: {
    numberOfBallots: function() {
      this.generateColors();
    }
  },
  mounted() {
    if (window.location.hostname == "localhost") {
      return;
    }
    this.track();
  },
  methods: {
    generateColors: function(event, time) {
      if (time == 5) {
        if (new Set(this.colors).size == 1) {
          alert('BINGO')
        }

        if (window.location.hostname == "localhost") {
          return;
        }
        this.$ga.event({
          eventCategory: "Ballots",
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
    },
    track() {
      this.$ga.page("/generate");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.vipps {
  margin: 20px auto auto auto;
}
.header-link {
  color: #333333;
  text-decoration: none;
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

.top-banner {
  margin-top: 0px;
  padding: 20px 0;
  background-color: #dbeede;
  box-shadow: 0 0 10px 0px #0000003a;
}

.vipps {
  margin-top: 8rem;

  @include mobile {
    margin-top: 2rem;
  }
}

input,
button {
  font-size: 1.5rem;
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

button {
  border: none;
  background: #b7debd;
  color: #333;
  padding: 10px 30px;
  margin: 0;
  width: fit-content;
  font-size: 1.3rem;
  display: block;
  height: calc(3rem + 18px);
  display: inline-flex;
  max-height: calc(3rem + 18px);
}

.colors-text {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
