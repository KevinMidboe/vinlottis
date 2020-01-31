<template>
  <div>
    <div
      class="vipps-container"
      :class="isMobile ? 'clickable' : null"
      @click="openVipps"
    >
      <img
        src="/public/assets/images/vipps-logo.svg"
        class="vipps-logo"
        alt="vipps logo"
      />
      <span v-if="amount * 10 > 10">
        kr.
        <span class="big-money">{{ amount * 10 }},-</span>
        (10,- pr. lodd)
      </span>
      <span v-if="amount * 10 == 10">
        kr.
        <span class="big-money">{{ amount * 10 }},-</span>
        pr. lodd
      </span>
      <ing
        src="/public/assets/images/vipps-qr.png"
        class="qr-logo"
        v-if="qrFailed"
      />
      <canvas v-if="!qrFailed" ref="canvas" class="qr-logo"></canvas>
      <span class="phone-number">{{ phone }}</span>
      <span class="name">{{ name }}</span>
      <span class="mark-with">Merk med: {{ message }}</span>
    </div>
    <p class="click-to-open-text" v-if="isMobile">
      <i>Du kan også klikke på QR-koden for å åpne i Vipps</i>
    </p>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: {
    amount: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      qrImage: null,
      qrFailed: false,
      phone: __PHONE__,
      name: __NAME__,
      message: __MESSAGE__
    };
  },
  watch: {
    amount: function(price) {
      this.calculateQr();
    }
  },
  mounted() {
    this.calculateQr();
  },
  computed: {
    isMobile: function() {
      return this.isMobileFunction();
    },
    price: function() {
      return this.amount * (__PRICE__ * 100);
    },
    vippsUrlBasedOnUserAgent: function() {
      if (navigator.userAgent.includes("iPhone")) {
        return (
          "https://qr.vipps.no/28/2/01/031/47" +
          this.phone.replace(/ /g, "") +
          "?v=1&m=" +
          this.message +
          "&a=" +
          this.price
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
    calculateQr: function() {
      let canvas = this.$refs["canvas"];
      QRCode.toCanvas(
        canvas,
        this.vippsUrlBasedOnUserAgent,
        { errorCorrectionLevel: "Q" },
        (err, url) => {
          if (err != null) {
            this.qrFailed = true;
          }
        }
      );

      this.drawLogoOverCanvas(canvas);
    },
    drawLogoOverCanvas(canvas) {
      const context = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      context.font = "30px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.arc(centerX, centerY, 25, 0, 2 * Math.PI, false);
      context.fillStyle = "white";
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = "#fe5b23";
      context.stroke();
      context.fillText("🍾", centerX, centerY);
    },
    openVipps: function() {
      if (!this.isMobileFunction()) {
        return;
      }
      window.location.assign(this.vippsUrlBasedOnUserAgent);
    },
    isMobileFunction: function() {
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
@import "../styles/global.scss";
@import "../styles/media-queries.scss";
.vipps-container {
  font-family: Arial;
  border-radius: 10px;
  background-color: #ff5b23;
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;
  padding: 25px;
  width: 250px;
  margin: auto 0;
}

.clickable {
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
    margin: auto;
  }

  .click-to-open-text {
    width: 65%;
    padding-top: 10px;
    margin: auto;
    text-align: center;
  }
}
</style>
