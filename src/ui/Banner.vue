<template>
  <router-link to="/" class="link">
    <div class="top-banner">
      <img src="/public/assets/images/knowit.svg" alt="knowit logo"/>
      <div class="clock">
        <h2 cv-if="distance > 0">
          <span v-if="days > 0">{{ pad(days) }}</span
          >: <span>{{ pad(hours) }}</span
          >: <span>{{ pad(minutes) }}</span
          >:
          <span>{{ pad(seconds) }}</span>
        </h2>
        <h2 v-if="distance <= 0">Lotteriet har begynt!</h2>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
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
  mounted() {
    this.initialize(), this.countdown();
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
      let now = new Date().getTime();
      this.distance = new Date(this.nextLottery).getTime() - now;
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

.link {
  text-decoration: none;
}

.top-banner {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 80px);
  margin-top: 0px;
  padding: 0px 40px;
  background-color: #dbeede;
  -webkit-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);

  @include mobile {
    padding: 0px 40px;

    > img {
      height: 23px;
    }
  }
}

.clock {
  text-decoration: none;
  color: #333333;
  display: flex;
  font-family: Arial;
  h2 {
    display: flex;
  }
}
</style>
