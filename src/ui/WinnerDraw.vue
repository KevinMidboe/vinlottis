<template>
  <div class="current-drawn-container">
    <div class="current-draw" v-if="drawing">
      <h2>TREKKER</h2>
      <div
        :class="currentColor + '-raffle'"
        class="ballot-element center-new-winner"
        :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
      >
        <span v-if="currentName && colorDone">{{ currentName }}</span>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
    
    <div class="current-draw" v-if="drawingDone">
      <h2>VINNER</h2>
      <div
        :class="currentColor + '-raffle'"
        class="ballot-element center-new-winner"
        :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"
      >
        <span v-if="currentName && colorDone">{{ currentName }}</span>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
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
      drawingDone: false,
      winnerQueue: []
    };
  },
  watch: {
    currentWinner: function(currentWinner) {
      if (currentWinner == null) {
        this.drawingDone = false;
        return;
      }
      if (this.drawing) {
        this.winnerQueue.push(currentWinner);
        return;
      }
      this.drawing = true;
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
        this.drawing = false;
        this.drawingDone = true;
        this.startConfetti(this.currentName);
        return;
      }
      this.currentName = this.attendees[
        this.nameRounds % this.attendees.length
      ].name;
      this.nameRounds += 1;
      clearTimeout(this.nameTimeout);
      this.nameTimeout = setTimeout(() => {
        this.drawName(winnerName);
      }, 50);
    },
    drawColor: function(winnerColor) {
      this.drawingDone = false;
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
      }, 50);
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
    startConfetti(currentName){
      //duration is computed as x * 1000 miliseconds, in this case 7*1000 = 7000 miliseconds ==> 7 seconds. 
      var duration = 7 * 1000;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 50, spread: 160, ticks: 50, zIndex: 0, particleCount: 20};
      var uberDefaults = { startVelocity: 65, spread: 75, zIndex: 0, particleCount: 35}

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        } 
        if(currentName == "Amund Brandsrud"){
          runCannon(uberDefaults, {x: 1, y: 1 }, {angle: 135});
          runCannon(uberDefaults, {x: 0, y: 1 }, {angle: 45}); 
          runCannon(uberDefaults, {y: 1 }, {angle: 90});
          runCannon(uberDefaults, {x: 0 }, {angle: 45});
          runCannon(uberDefaults, {x: 1 }, {angle: 135});     
        }else{
          runCannon(defaults, {x: 0 }, {angle: 45});
          runCannon(defaults, {x: 1 }, {angle: 135});
          runCannon(defaults, {y: 1 }, {angle: 90});
   
        }
      }, 250);

      function runCannon(confettiDefaultValues, originPoint, launchAngle){
        confetti(Object.assign({}, confettiDefaultValues, {origin: originPoint }, launchAngle))
      }
    },
  }
};

</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

h2 {
  text-align: center;
}

.current-drawn-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.raffle-element {
  width: 140px;
  height: 140px;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  text-align: center;
}
</style>
