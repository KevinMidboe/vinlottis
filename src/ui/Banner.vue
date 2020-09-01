<template>
  <router-link to="/" class="link">
    <div class="top-banner">
      <img src="/public/assets/images/knowit.svg" alt="knowit logo" />
      <div v-for="(route, index) in routes" :key="index" >
        <router-link :to="route.route" class="__routes">
          {{route.name}}
        </router-link>
      </div>
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
      interval: null,
      routes: [
        {
          name: "Dagens viner",
          route: "/dagens/"
        },
        {
          name: "History",
          route: "/history/"
        },
        {
          name: "Lotteriet",
          route: "/lottery/game/"
        },
        // {
        //   name: "Foreslå vin",
        //   route: "/request"
        // },
        // {
        //   name: "Foreslåtte viner",
        //   route: "/all-requested-wines"
        // },
      ]
    };
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
@import "../styles/media-queries.scss";
@import "../styles/variables.scss";

.link {
  text-decoration: none;
  color: #333333;

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
  background-color: $primary;
  -webkit-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);

  .__routes{
    text-decoration: none;
    color: #333333;

    @include mobile {
      display: none;
    }
  }

  @include mobile {
    padding: 0px 40px;

    > img {
      height: 23px;
    }

    // .__routes{
    //   display: none;
    // }
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
