<template>
  <div class="container">
    <h1 class="text-center title" @click="startCountdown">Loddgenerator</h1>
    <p class="subtext">
      Velg hvilke farger du vil ha, fyll inn antall lodd og klikk 'generer'
    </p>

    <RaffleGenerator @numberOfRaffles="val => this.numberOfRaffles = val" />

    <Vipps class="vipps" :amount="numberOfRaffles" />
    <Countdown :hardEnable="hardStart" @countdown="changeEnabled" />
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
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
      this.$ga.page("/lottery/generate");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/global.scss";
@import "../styles/media-queries.scss";

.container {
  display: flex;
  flex-direction: column;
  margin-top: 0;
}

h1 {
  cursor: pointer;
}

p {
  text-align: center;
  margin: 0;
}

.vipps {
  margin: 5rem auto 2.5rem auto;

  @include mobile {
    margin-top: 2rem;
  }
}
</style>
