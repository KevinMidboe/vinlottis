<template>
  <div>
    <h2 v-if="errorMessage">{{ errorMessage }}</h2>
    <video playsinline autoplay class="hidden"></video>
  </div>
</template>

<script>
import { BrowserBarcodeReader } from "@zxing/library";
import { barcodeToVinmonopolet } from "@/api";

export default {
  name: "Scan to vinnopolet",
  data() {
    return {
      video: undefined,
      errorMessage: undefined
    };
  },
  mounted() {
    if (navigator.mediaDevices == undefined) {
      this.errorMessage = "Feil: Ingen kamera funnet.";
      return;
    }

    setTimeout(() => {
      this.video = document.querySelector("video");
      this.scrollIntoView();

      const constraints = {
        audio: false,
        video: {
          facingMode: "environment"
        }
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.handleSuccess)
        .catch(this.handleError);
    }, 10);
  },
  methods: {
    handleSuccess(stream) {
      this.video.classList.remove("hidden");
      this.video.srcObject = stream;
      this.searchVideoForBarcode(this.video);
    },
    handleError(error) {
      console.log(
        "navigator.MediaDevices.getUserMedia error: ",
        error.message,
        error.name
      );
      this.errorMessage =
        "Feil ved oppstart av kamera! Feilmelding: " + error.message;
    },
    searchVideoForBarcode(video) {
      const codeReader = new BrowserBarcodeReader();

      codeReader
        .decodeOnceFromVideoDevice(undefined, video)
        .then(result => {
          barcodeToVinmonopolet(result.text)
            .then(this.emitWineFromVinmonopolet)
            .catch(this.catchVinmonopoletError)
            .then(this.searchVideoForBarcode(video));
        })
        .catch(err => console.error(err));
    },
    emitWineFromVinmonopolet(response) {
      this.errorMessage = "";

      this.$emit("wine", {
        name: response.name,
        vivinoLink: "https://vinmonopolet.no" + response.url,
        price: response.price.value,
        image: response.images[1].url,
        country: response.main_country.name,
        id: Number(response.code)
      });
    },
    catchVinmonopoletError(error) {
      this.errorMessage = "Feil! " + error.message || error;
    },
    scrollIntoView() {
      window.scrollTo(
        0,
        document.getElementById("addwine-title").offsetTop - 10
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/global";

video {
  width: 100%;
  margin: 1rem 0;
}

.hidden {
  height: 0px;
}

h2 {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  color: $red;
}
</style>