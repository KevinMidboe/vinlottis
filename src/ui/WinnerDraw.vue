<template>
  <div class="current-drawn-container">
    <div class="current-draw" v-if="drawing">
      <h2>TREKKER</h2>
      <div
        :class="currentColor + '-ballot'"
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
        :class="currentColor + '-ballot'"
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
}

.current-drawn-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ballot-element {
  width: 140px;
  height: 140px;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
