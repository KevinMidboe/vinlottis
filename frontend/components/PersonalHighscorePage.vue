<template>
  <div class="container">
    <h1>Vinlottis highscore</h1>

    <div class="backdrop">
      <a @click="navigateBack" @keydown.enter="navigateBack" tabindex="0">
        ⬅ <span class="vin-link navigate-back">Tilbake til {{ previousRoute.name }}</span>
      </a>

      <section v-if="winner">
        <h2 class="name">{{ winner.name }}</h2>

        <p class="win-count el-spacing">{{ numberOfWins }} vinn</p>

        <h4 class="margin-bottom-0">Vinnende farger:</h4>
        <div class="raffle-container el-spacing">
          <div
            class="raffle-element"
            :class="color + `-raffle`"
            v-for="[color, occurences] in Object.entries(winningColors)"
            :key="color"
          >
            {{ occurences }}
          </div>
        </div>

        <h4 class="el-spacing">Flasker vunnet:</h4>

        <div v-for="win in winner.wins" :key="win._id">
          <router-link :to="winDateUrl(win.date)" class="days-ago">
            {{ humanReadableDate(win.date) }} - {{ daysAgo(win.date) }}
          </router-link>

          <div class="won-wine" v-if="win.wine">
            <img :src="smallerWineImage(win.wine.image)" />

            <div class="won-wine-details">
              <h3>{{ win.wine.name }}</h3>
              <a :href="win.wine.vivinoLink" class="vin-link no-margin">
                Les mer på vinmonopolet.no
              </a>
            </div>

            <div class="raffle-element small" :class="win.color + `-raffle`"></div>
          </div>
          <div class="won-wine" v-else>
            <div class="won-wine-details">
              <h3>Oisann! Klarte ikke finne vin.</h3>
            </div>
          </div>
        </div>
      </section>

      <h2 v-else-if="error" class="error">
        {{ error }}
      </h2>
    </div>
  </div>
</template>

<script>
import { dateString, humanReadableDate, daysAgo } from "@/utils";

export default {
  data() {
    return {
      winner: undefined,
      name: undefined,
      error: undefined,
      previousRoute: {
        default: true,
        name: "topplisten",
        path: "/highscore"
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name != null) vm.previousRoute = from;
    });
  },
  computed: {
    numberOfWins() {
      return this.winner.wins.length;
    }
  },
  created() {
    this.name = this.$route.params.name;
    this.getWinnerByName(this.name)
      .then(winner => this.setWinner(winner))
      .catch(err => (this.error = `Ingen med navn: "${nameFromURL}" funnet.`));
  },
  methods: {
    getWinnerByName(name) {
      return fetch(`/api/history/by-name/${name}`)
        .then(resp => resp.json())
        .then(response => response.winner);
    },
    setWinner(winner) {
      this.winner = {
        name: winner.name,
        highscore: [],
        ...winner
      };
      this.winningColors = this.findWinningColors();
    },
    smallerWineImage(image) {
      if (image && image.includes(`515x515`)) return image.replace(`515x515`, `175x175`);
      if (image && image.includes(`500x500`)) return image.replace(`500x500`, `175x175`);
      return image;
    },
    findWinningColors() {
      const colors = this.winner.wins.map(win => win.color);
      const colorOccurences = {};
      colors.forEach(color => {
        if (colorOccurences[color] == undefined) {
          colorOccurences[color] = 1;
        } else {
          colorOccurences[color] += 1;
        }
      });
      return colorOccurences;
    },
    winDateUrl(date) {
      const dateParameter = dateString(new Date(date));
      return `/history/${dateParameter}`;
    },
    navigateBack() {
      if (this.previousRoute.default) {
        this.$router.push({ path: this.previousRoute.path });
      } else {
        this.$router.go(-1);
      }
    },
    humanReadableDate: humanReadableDate,
    daysAgo(date) {
      const days = daysAgo(date);
      if (days == 0) {
        return "i dag";
      } else {
        return `${days} dager siden`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/media-queries";

$elementSpacing: 3rem;

.el-spacing {
  margin-bottom: $elementSpacing;
}

.navigate-back {
  font-weight: normal;
  font-size: 1.2rem;
  border-width: 2px;
  border-color: gray;
}

.container {
  width: 90vw;
  margin: 3rem auto;
  margin-bottom: 0;
  padding-bottom: 3rem;
  max-width: 1200px;

  @include desktop {
    width: 80vw;
  }
}

h1 {
  font-size: 3rem;
  font-family: "knowit";
  font-weight: normal;
}

.name {
  text-transform: capitalize;
  font-size: 3.5rem;
  font-family: "knowit";
  font-weight: normal;
  margin: 2rem 0 1rem 0;
}

.error {
  font-size: 2.5rem;
  font-weight: normal;
}

.win-count {
  font-size: 1.5rem;
  margin-top: 0;
}

.raffle-container {
  display: flex;
  margin-top: 1rem;

  div:not(:last-of-type) {
    margin-right: 1.5rem;
  }
}
.raffle-element {
  width: 5rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-top: 0;

  &.small {
    height: 40px;
    width: 40px;
  }
}

.days-ago {
  color: $matte-text-color;
  border-bottom: 2px solid transparent;

  &:hover {
    border-color: $link-color;
  }
}

.won-wine {
  --spacing: 1rem;
  background-color: white;
  margin: var(--spacing) 0 3rem 0;
  padding: var(--spacing);

  position: relative;

  @include desktop {
    flex-direction: row;
  }

  img {
    margin: 0 3rem;
    height: 160px;
  }

  &-details {
    vertical-align: top;
    display: inline-block;

    @include tablet {
      width: calc(100% - 160px - 80px);
    }

    & > * {
      width: 100%;
    }

    h3 {
      font-size: 1.5rem;
      font-weight: normal;
      color: $matte-text-color;
    }

    a {
      font-size: 1.2rem;
      border-width: 2px;
      font-weight: normal;
    }
  }

  .raffle-element {
    position: absolute;
    top: calc(var(--spacing) * 2);
    right: calc(var(--spacing) * 2);
    margin: 0;
  }
}

.backdrop {
  $background: rgb(244, 244, 244);

  --padding: 2rem;
  @include desktop {
    --padding: 5rem;
  }
  background-color: $background;
  padding: var(--padding);
}
</style>
