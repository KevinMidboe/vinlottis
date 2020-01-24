<template>
  <div class="vipps-container" @click="openVipps">
      <img src="/public/assets/images/vipps-logo.svg" class="vipps-logo" />
      <span>
        kr.
        <span class="big-money">{{ amount * 10 }},- (10,- pr. lodd)</span>
      </span>
      <img src="/public/assets/images/vipps-qr.png" class="qr-logo" />
      <span class="phone-number">977 40 427</span>
      <span class="name">Kasper Rynning-Tønnesen</span>
      <span class="mark-with">Merk med: Vinlodd/🍾</span>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: Number,
      default: 10
    }
  },
  computed: {
    price: function() {
      return this.amount * 100
    }
  },
  methods: {
    openVipps: function() {
      window.location.assign('https://qr.vipps.no/28/2/01/031/4797740427?v=1&m=Vinlotteri🍾&a=' + this.price)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";
.vipps-container {
  font-family: Arial;
}

.vipps-container {
  border-radius: 10px;
  background-color: #ff5b23;
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;
  padding: 25px;
  width: 250px;
  margin: auto 0;
  cursor: pointer;
}

.big-money {
  font-size: 1.5rem;
  font-weight: bold;
}

.vipps-logo {
  padding-bottom: 10px;
}

.phone-number {
  font-size: 1.75rem;
  font-weight: bold;
  padding-top: 20px;
  padding-bottom: 10px;
}

.qr-logo {
  margin-top: 15px;
  border-radius: 10px;
  width: 220px;
  margin: 15px auto auto auto;
}

.name,
.mark-with {
  font-weight: 600;
  font-size: 1rem;
}

@include mobile {
  .vipps-container {
    margin-left: 0px;
  }
}
</style>
