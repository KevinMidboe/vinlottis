<template>
  <div>
    <div class="clock" v-if="enabled">
      <h2 cv-if="distance > 0">
        <span v-if="days > 0">{{ pad(days) }}</span
        >: <span>{{ pad(hours) }}</span
        >: <span>{{ pad(minutes) }}</span
        >:
        <span>{{ pad(seconds) }}</span>
      </h2>
      <div class="cross" @click="stopClock">X</div>
      <h2 v-if="distance <= 0">Lotteriet har begynt!</h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hardEnable: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      nextLottery: null,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      distance: 0,
      enabled: false,
      code: "38384040373937396665",
      codeDone: "",
      interval: null
    };
  },
  watch: {
    hardEnable: function(hardEnable) {
      if (hardEnable) {
        this.enabled = true;
        this.initialize();
        this.countdown();
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.listenerFunction);
  },
  methods: {
    pad: function(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    },
    listenerFunction: function(event) {
      this.codeDone += event.keyCode;
      if (this.code.substring(0, this.codeDone.length) == this.codeDone) {
        if (this.code == this.codeDone && !this.enabled) {
          this.enabled = true;
          this.initialize();
          this.countdown();
          this.codeDone = "";
        }
      } else {
        this.codeDone = "";
      }
    },
    initialize: function() {
      let d = new Date();
      let dayOfLottery = 5;
      let dayDifference = (dayOfLottery + 7 - d.getDay()) % 7;
      if (dayDifference == 0) {
        dayDifference = 7;
      }
      let nextDayOfLottery = new Date(d.setDate(d.getDate() + dayDifference));
      nextDayOfLottery = new Date(nextDayOfLottery.setHours(15));
      nextDayOfLottery = new Date(nextDayOfLottery.setMinutes(0));
      nextDayOfLottery = new Date(nextDayOfLottery.setSeconds(0));
      this.nextLottery = nextDayOfLottery;
      window.scrollTo(0, 0);
      document.querySelector("body").style.overflow = "hidden";
      document.querySelector("body").style.height = "100vh";
      let now = new Date().getTime();
      this.distance = new Date(this.nextLottery).getTime() - now;
    },
    stopClock: function() {
      clearInterval(this.interval);
      this.enabled = false;
      document.querySelector("body").style.overflow = "auto";
      document.querySelector("body").style.height = "initial";
      this.$emit("countdown", false);
    },
    countdown: function() {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      this.distance = new Date(this.nextLottery).getTime() - now;

      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor(
        (this.distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

      if (this.distance < 0) {
        clearTimeout(this.interval);
        return;
      }
      this.interval = setTimeout(this.countdown, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
.clock {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: white;
  top: 0;
  left: 0;

  @include mobile {
    width: 105vw;
    height: 110vh;
  }
}
.cross {
  top: 15px;
  right: 23px;
  font-size: 2rem;
  position: absolute;
  cursor: pointer;

  @include mobile {
    right: 45px;
  }
}

h2 {
  margin: auto;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
}
</style>
