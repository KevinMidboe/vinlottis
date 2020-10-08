<template>
  <div class="container">
    <h1>Vinlottis highscore</h1>

    <div class="backdrop">
      <router-link to="/highscore">
        ⬅ <h3 class="vin-link">Tilbake til topplisten</h3>
      </router-link>

      <section v-if="winner">
        <h2 class="name">{{ winner.name }}</h2>

        <p class="win-count el-spacing">{{ numberOfWins }} vinn</p>

        <h4 class="margin-bottom-0">Vinnende farger:</h4>
        <div class="raffle-container el-spacing">
          <div class="raffle-element" :class="color + `-raffle`" v-for="[color, occurences] in Object.entries(winningColors)">
            {{ occurences }}
          </div>
        </div>

        <h4 class="el-spacing">Flasker vunnet:</h4>

        <div v-for="win in winner.highscore">
          <span class="date-won">{{ humanReadableDate(win.date) }} - {{ daysAgo(win.date) }} dager siden</span>
          
          <div class="won-wine">
            <img :src="win.wine.image">

            <div class="wine-details">
              <h3>{{ win.wine.name }}</h3>
              <a :href="win.wine.vivinoLink" class="vin-link no-margin">
                Les mer på vinmonopolet.no
              </a>
            </div>

            <div class="raffle-element small" :class="win.color + `-raffle`"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getWinnerByName } from "@/api";
import { humanReadableDate, daysAgo } from "@/utils";

export default {
  props: {
    winnerObject: {
      type: Object,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      winner: undefined
    }
  },
  computed: {
    numberOfWins() {
      return this.winner.highscore.length
    }
  },
  methods: {
    setWinner(winner) {
      this.winner = winner
      this.winningColors = this.findWinningColors()
    },
    findWinningColors() {
      const colors = this.winner.highscore.map(win => win.color)
      const colorOccurences = {}
      colors.forEach(color => {
        if (colorOccurences[color] == undefined) {
          colorOccurences[color] = 1
        } else {
          colorOccurences[color] += 1
        }
      })
      return colorOccurences
    },
    humanReadableDate: humanReadableDate,
    daysAgo: daysAgo
  },
  created() {
    const nameFromURL = this.$route.params.name;
    if (this.winnerObject === undefined && nameFromURL !== null)
      getWinnerByName(nameFromURL).then(winner => this.setWinner(winner))
  }
}
</script>

<style lang="scss" scoped>
@import "./src/styles/variables";
@import "./src/styles/media-queries";

$elementSpacing: 4rem;

.el-spacing {
  margin-bottom: $elementSpacing;
}

.container {
  width: 90vw;  
  margin: 0 auto;
  max-width: 1500px;

  @include desktop {
    width: 80vw;
  }
}

h1 {
  font-size: 2.8rem;
  font-family: "knowit";
  font-weight: normal;
}

h3 {
  display: inline-block;
}

.name {
  text-transform: capitalize;
  font-size: 2.2rem;
  font-family: "knowit";
  font-weight: normal;
}

.win-count {
  font-size: 1.2rem;
}

.raffle-container {
  display: flex;
  margin-top: 1rem;

  div:not(:last-of-type) {
    margin-right: 1rem;
  }
}
.raffle-element {
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 0;

  &.small {
    height: 40px;
    width: 40px;
  }
}

.won-wine {
  --spacing: 1rem;
  background-color: white;
  margin: var(--spacing) 0 4rem 0;
  padding: var(--spacing);

  position: relative;

  @include desktop {
    flex-direction: row;
  }

  img {
    // width: 60px;
    margin: 0 3rem;
    height: 160px;
  }

  .wine-details {
    vertical-align: top;
    display: inline-block;

    @include tablet {
      width: calc(100% - 160px);
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
      font-size: 1.3rem;
      border-width: 2px;
      font-weight: normal;
    }
  }

  .raffle-element {
    position: absolute;
    top: var(--spacing);
    right: var(--spacing);
    margin: 0;
  }
}


.backdrop {
  $background: rgb(244,244,244);
  
  --horizontal-padding: 2rem;
  @include desktop {
    $horizontal-padding: 5rem;
  }
  background-color: $background;
  height: 100%;
  width: calc(100% - calc(var(--horizontal-padding) * 2);

  padding: 2rem var(--horizontal-padding);
}
</style>