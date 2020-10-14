<template>
  <div class="top-banner">
    <!-- Mobile -->
    <router-link to="/" class="company-logo">
      <img src="/assets/images/knowit.svg" alt="knowit logo" />
    </router-link>

    <a class="menu-toggle-container" aria-label="show-menu" @click="toggleMenu" :class="isOpen ? 'open' : 'collapsed'" >
      <span class="menu-toggle"></span>
      <span class="menu-toggle"></span>
      <span class="menu-toggle"></span>
    </a>

    <nav class="menu" :class="isOpen ? 'open' : 'collapsed'" >
      <router-link v-for="(route, index) in routes" :key="index" :to="route.route" class="menu-item-link" >
        <a @click="toggleMenu" class="single-route" :class="isOpen ? 'open' : 'collapsed'">{{route.name}}</a>
      </router-link>
    </nav>
    
    <div class="clock">
      <h2 v-if="!fiveMinutesLeft || !tenMinutesOver">
        <span v-if="days > 0">{{ pad(days) }}:</span>
        <span>{{ pad(hours) }}</span>:
        <span>{{ pad(minutes) }}</span>:
        <span>{{ pad(seconds) }}</span>
      </h2>
      <h2 v-if="twoMinutesLeft || tenMinutesOver">Lotteriet er i gang!</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      nextLottery: null,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      distance: 0,
      interval: null,
    };
  },
  props: {
    routes: {
      required: true,
      type: Array
    }
  },
  mounted() {
    this.initialize(), this.countdown();
  },
  computed: {
    fiveMinutesLeft: function() {
      if (this.days == 0 && this.hours == 0 && this.minutes <= 2) {
        return true;
      }
      return false;
    },
    tenMinutesOver: function() {
      if (this.days == 6 && this.hours >= 23 && this.minutes >= 50) {
        return true;
      }
      return false;
    }
  },
  methods: {
    toggleMenu(){
      this.isOpen = this.isOpen ? false : true;
    },
    pad: function(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    },
    initialize: function() {
      let d = new Date();
      let dayOfLottery = __DATE__;
      let dayDifference = (dayOfLottery + 7 - d.getDay()) % 7;
      if (dayDifference == 0) {
        dayDifference = 7;
      }
      let nextDayOfLottery = new Date(d.setDate(d.getDate() + dayDifference));
      nextDayOfLottery = new Date(nextDayOfLottery.setHours(__HOURS__));
      nextDayOfLottery = new Date(nextDayOfLottery.setMinutes(0));
      nextDayOfLottery = new Date(nextDayOfLottery.setSeconds(0));
      let nowDate = new Date();
      let now = nowDate.getTime();
      if (nextDayOfLottery.getTimezoneOffset() != nowDate.getTimezoneOffset()) {
        let _diff =
          (nextDayOfLottery.getTimezoneOffset() - nowDate.getTimezoneOffset()) *
          60 *
          -1;
        nextDayOfLottery.setSeconds(nextDayOfLottery.getSeconds() + _diff);
      }
      this.nextLottery = nextDayOfLottery;

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
      if (this.days == 7) {
        this.days = 0;
      }
      if (this.distance < 0) {
        this.initialize();
      }
      this.interval = setTimeout(this.countdown, 500);
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/banner.scss";
</style>
