<template>
  <div>
    <div class="floating-video">
      <video autoplay loop muted playsinline id="office-party" ref="video">
        <source src="/public/assets/videos/office-party.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="container">
      <div class="container--code label-div row">
        <label>Din vinlottis kode:</label>
      </div>

      <div id="code-container" class="codeinput-container">
        <input v-model="code" placeholder="KODE" @keyup.enter="submit" />
        <button class="vin-button" @click="submit">ENTER</button>
      </div>

      <button class="mute-button" @click="toggleMute">
        {{ muted ? "🔇" : "🔈" }}
      </button>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "@/ui/FooterUnbranded";
import { createCookie } from "@/utils";

export default {
  components: { Footer },
  data() {
    return {
      muted: true,
      code: undefined,
      // volume: 50,
    };
  },
  created() {
    const site = __sites__.find(site => site.code == this.code);
  },
  // watch: {
  //   volume(newValue) {
  //     this.$refs.video.volume = newValue / 100;
  //   },
  // },
  methods: {
    toggleMute() {
      const { video } = this.$refs;
      this.muted = !this.muted;
      video.muted = this.muted;
    },
    togglePlayback() {
      const { video } = this.$refs;
      video.paused ? video.play() : video.pause();
    },
    smh() {
      let inputContainer = document.getElementById('code-container')
      inputContainer.classList.add('shake')
      if (this.timeout)
        clearTimeout(this.timeout)
      this.timeout = setTimeout(() => inputContainer.classList.remove('shake'), 600);
    },
    submit() {
      const site = __sites__.find(site => site.code?.toLowerCase() == this.code?.toLowerCase());

      if (site) {
        createCookie("accesscode", site.code, 14);
        const path = (location.pathname+location.search).substr(1)
        const redirectUrl = `${window.location.protocol}//${site.domain}/${path}`
        window.location.href = redirectUrl;
      } else {
        this.smh()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries";

.floating-video {
  position: absolute;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  display: grid;
  place-items: center;
  background-color: var(--primary);
  z-index: -1;
}

.mute-button {
  z-index: 10;
  -webkit-appearance: unset;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  bottom: calc(75px + 1rem);
  cursor: pointer;

  input[type="range"] {
    transform: rotate(90deg);
    background-color: red;
  }
}

video {
  position: absolute;
  display: block;
  // left: 0;
  height: 100%;

  // -o-filter: blur(1px);
  filter: blur(5px);
  object-fit: cover;
  transform: scale(1.02);

  @include mobile {
    top: 0;
  }
}

.codeinput-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @include mobile {
    width: 80%;
  }

  &.shake {
    animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    animation-iteration-count: infinite;
  }

  input {
    max-width: 24rem;
    width: 100%;
    padding: 0.5rem;

    font-size: 4rem;
    text-align: center;
    z-index: 2;
    background-color: white;

    @include mobile {
      font-size: 3rem;
    }
  }

  button {
    height: 100%;
    max-height: unset;
    font-weight: bold;
  }
}

.container {
  width: 100%;
  height: calc(100vh - 80px);
  margin: auto;
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  justify-content: center;

  @include desktop {
    justify-content: center;
  }

  h1 {
    position: relative;
    // text-align: center;
    font-weight: 600;
    // color: white;

    @include desktop {
      font-size: 3rem;
    }
  }

  &--code {
    display: flex;
    align-items: center;

    label {
      color: rgba(255, 255, 255, 0.82);
      text-shadow: 1px 1px black;
      font-size: 1.5rem;
      font-weight: 500;
    }

    @include desktop {
      width: 40%;
    }
  }
}

.input-line {
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2.4rem;

  @include mobile {
    margin-top: 1.2rem;
  }
}

.button-container {
  margin-top: 4rem;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
