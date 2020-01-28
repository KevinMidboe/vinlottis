<template>
  <div class="vipps-container" @click="openVipps">
    <img src="/public/assets/images/vipps-logo.svg" class="vipps-logo" alt="vipps logo" />
    <span>
      kr.
      <span class="big-money">{{ amount * 10 }},- (10,- pr. lodd)</span>
    </span>
    <ing src="/public/assets/images/vipps-qr.png" class="qr-logo" v-if="qrFailed" />
    <canvas v-if="!qrFailed" ref="canvas" class="qr-logo"></canvas>
    <span class="phone-number">977 40 427</span>
    <span class="name">Kasper Rynning-Tønnesen</span>
    <span class="mark-with">Merk med: Vinlodd/🍾</span>
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
      qrFailed: false
    };
  },
  watch: {
    amount: function(price) {
      console.log("price is updated", price);
      this.calculateQr();
    }
  },
  mounted() {
    this.calculateQr();
  },
  computed: {
    price: function() {
      return this.amount * 1000;
    },
    vippsUrlBasedOnUserAgent: function() {
      if (navigator.userAgent.includes("iPhone")) {
        return (
          "https://qr.vipps.no/28/2/01/031/4797740427?v=1&m=Vinlotteri%20🍾&a=" +
          this.price
        );
      }

      return "https://qr.vipps.no/28/2/01/031/4797740427?v=1&m=Vinlotteri%20🍾";
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
      window.location.assign(this.vippsUrlBasedOnUserAgent);
    }
  }
};
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
