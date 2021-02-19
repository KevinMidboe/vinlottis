<template>
  <div class="container">
    <h1 class="title" @click="startCountdown">Loddgenerator</h1>
    <p class="subtext">
      Velg hvilke farger du vil ha, fyll inn antall lodd og klikk 'generer'
    </p>

    <RaffleGenerator @numberOfRaffles="val => (this.numberOfRaffles = val)" />

    <Vipps class="vipps" :amount="numberOfRaffles" />
    <Countdown :hardEnable="hardStart" @countdown="changeEnabled" />
  </div>
</template>

<script>
import RaffleGenerator from "@/ui/RaffleGenerator";
import Vipps from "@/ui/Vipps";
import Countdown from "@/ui/Countdown";

export default {
  components: {
    RaffleGenerator,
    Vipps,
    Countdown
  },
  data() {
    return {
      hardStart: false,
      numberOfRaffles: null
    };
  },
  mounted() {
    if (window.location.hostname == "localhost") {
      return;
    }
    this.track();
  },
  methods: {
    changeEnabled: function(way) {
      this.hardStart = way;
    },
    startCountdown: function() {
      this.hardStart = true;
    },
    track() {
      window.ga("send", "pageview", "/lottery/generate");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/global.scss";
@import "@/styles/media-queries.scss";
h1 {
  cursor: pointer;
}
.header-link {
  color: #333333;
  text-decoration: none;
}

p {
  text-align: center;
  margin: 0;
}

.vipps {
  display: flex;
  justify-content: center;
  margin-top: 4rem;

  @include mobile {
    margin-top: 2rem;
  }
}

.container {
  display: flex;
  flex-direction: column;
}
</style>
