<template>
  <div aria-label="button" role="button" @click="openVipps" tabindex="0">
    <img src="public/assets/images/vipps-pay_with_vipps_pill.png" />
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      phone: __PHONE__,
      name: __NAME__,
      price: __PRICE__,
      message: __MESSAGE__
    };
  },
  computed: {
    isMobile: function() {
      return this.isMobileFunction();
    },
    priceToPay: function() {
      return this.amount * (this.price * 100);
    },
    vippsUrlBasedOnUserAgent: function() {
      if (navigator.userAgent.includes("iPhone")) {
        return (
          "https://qr.vipps.no/28/2/01/031/47" +
          this.phone.replace(/ /g, "") +
          "?v=1&m=" +
          this.message +
          "&a=" +
          this.priceToPay
        );
      }

      return (
        "https://qr.vipps.no/28/2/01/031/47" +
        this.phone.replace(/ /g, "") +
        "?v=1&m=" +
        this.message
      );
    }
  },
  methods: {
    openVipps() {
      if (!this.isMobileFunction()) {
        return;
      }
      window.location.assign(this.vippsUrlBasedOnUserAgent);
    },
    isMobileFunction() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  cursor: pointer;
  width: 100%;
}
</style>
