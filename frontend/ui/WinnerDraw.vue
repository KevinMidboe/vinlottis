<template>
  <div class="current-drawn-container" v-if="drawing">
    <h2 v-if="winnersNameDrawn !== true">TREKKER {{ ordinalNumber() }} VINNER</h2>
    <h2 v-else>VINNER</h2>

    <div
      :class="currentColor + '-raffle'"
      class="raffle-element"
      :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
    >
      <span v-if="currentName && colorDone">{{ currentName }}</span>
    </div>

    <br />
    <br />
  </div>
</template>

<script>
import confetti from "canvas-confetti";
export default {
  props: {
    currentWinner: {
      type: Object
    },
    currentWinnerDrawn: {
      type: Boolean
    },
    attendees: {
      type: Array
    }
  },
  data() {
    return {
      currentWinnerLocal: {},
      winnerColor: null,
      currentColor: null,
      winnerName: null,
      currentName: null,
      colorRounds: 0,
      nameRounds: 0,
      colorTimeout: null,
      nameTimeout: null,
      colorDone: false,
      drawing: false,
      winnersNameDrawn: false,
      winnerQueue: []
    };
  },
  watch: {
    currentWinner: function(currentWinner) {
      if (currentWinner == null) {
        return;
      }
      if (this.drawing) {
        this.winnerQueue.push(currentWinner);
        return;
      }
      this.drawing = true;
      this.winnersNameDrawn = false;
      this.currentName = null;
      this.currentColor = null;
      this.nameRounds = 0;
      this.colorRounds = 0;
      this.colorDone = false;
      this.currentWinnerLocal = currentWinner;
      this.drawColor(this.currentWinnerLocal.color);
    }
  },
  methods: {
    drawName: function(winnerName) {
      if (this.nameRounds == 100) {
        clearTimeout(this.nameTimeout);
        this.currentName = winnerName;
        if (this.winnerQueue.length > 0) {
          this.currentWinnerLocal = this.winnerQueue.shift();
          this.drawing = true;
          this.nameRounds = 0;
          this.colorRounds = 0;
          this.colorDone = false;
          this.drawColor(this.currentWinnerLocal.color);
          return;
        }
        this.winnersNameDrawn = true;
        this.startConfetti(this.currentName);
        return;
      }
      this.currentName = this.attendees[this.nameRounds % this.attendees.length].name;
      this.nameRounds += 1;
      clearTimeout(this.nameTimeout);
      this.nameTimeout = setTimeout(() => {
        this.drawName(winnerName);
      }, 50);
    },
    drawColor: function(winnerColor) {
      this.winnersNameDrawn = false;
      if (this.colorRounds == 100) {
        this.currentColor = winnerColor;
        this.colorDone = true;
        this.drawName(this.currentWinnerLocal.name);

        clearTimeout(this.colorTimeout);
        return;
      }
      this.currentColor = this.getColor(this.colorRounds % 4);
      this.colorRounds += 1;

      clearTimeout(this.colorTimeout);
      this.colorTimeout = setTimeout(() => {
        this.drawColor(winnerColor);
      }, 70);
    },
    getRotation: function() {
      if (this.colorDone) {
        return 0;
      }
      let num = Math.floor(Math.random() * 15);
      let neg = Math.floor(Math.random() * 2);
      return neg == 0 ? -num : num;
    },
    getColor: function(number) {
      switch (number) {
        case 0:
          return "red";
        case 1:
          return "blue";
        case 2:
          return "green";
        case 3:
          return "yellow";
      }
    },
    startConfetti(currentName) {
      //duration is computed as x * 1000 miliseconds, in this case 7*1000 = 7000 miliseconds ==> 7 seconds.
      var duration = 7 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 50, spread: 160, ticks: 50, zIndex: 0, particleCount: 20 };
      var uberDefaults = { startVelocity: 65, spread: 75, zIndex: 0, particleCount: 35 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const self = this;
      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          self.drawing = false;
          return clearInterval(interval);
        }
        if (currentName == "Amund Brandsrud") {
          runCannon(uberDefaults, { x: 1, y: 1 }, { angle: 135 });
          runCannon(uberDefaults, { x: 0, y: 1 }, { angle: 45 });
          runCannon(uberDefaults, { y: 1 }, { angle: 90 });
          runCannon(uberDefaults, { x: 0 }, { angle: 45 });
          runCannon(uberDefaults, { x: 1 }, { angle: 135 });
        } else {
          runCannon(defaults, { x: 0 }, { angle: 45 });
          runCannon(defaults, { x: 1 }, { angle: 135 });
          runCannon(defaults, { y: 1 }, { angle: 90 });
        }
      }, 250);

      function runCannon(confettiDefaultValues, originPoint, launchAngle) {
        confetti(Object.assign({}, confettiDefaultValues, { origin: originPoint }, launchAngle));
      }
    },
    ordinalNumber(number = this.currentWinnerLocal.winnerCount) {
      const dictonary = {
        1: "første",
        2: "andre",
        3: "tredje",
        4: "fjerde",
        5: "femte",
        6: "sjette",
        7: "syvende",
        8: "åttende",
        9: "niende",
        10: "tiende",
        11: "ellevte",
        12: "tolvte"
      };
      return number in dictonary ? dictonary[number] : number;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

h2 {
  text-align: center;
  text-transform: uppercase;
}

.current-drawn-container {
  grid-column: 1 / 5;
  display: grid;
  place-items: center;
  position: relative;
}

.raffle-element {
  width: 280px;
  height: 300px;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  -webkit-mask-size: cover;
  -moz-mask-size: cover;
  mask-size: cover;
}
</style>
