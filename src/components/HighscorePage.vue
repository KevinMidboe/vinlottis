<template>
  <div class="container">
    <h1>Vinlottis highscore</h1>

    <div class="filter flex el-spacing">
      <input type="text" v-model="filterInput" placeholder="Filtrer på navn" />
      <button v-if="filterInput" @click="resetFilter" class="vin-button auto-height margin-left-sm">
        Reset
      </button>
    </div>

    <p class="highscore-header margin-bottom-md"><b>Plassering.</b> Navn - Antall vinn</p>

    <ol v-if="highscore.length > 0" class="highscore-list">
      <li v-for="person in filteredResults" @click="selectWinner(person)" @keydown.enter="selectWinner(person)" tabindex="0">
        <b>{{ person.rank }}.</b>&nbsp;&nbsp;&nbsp;{{ person.name }} - {{ person.wins.length }}
      </li>
    </ol>

    <div class="center desktop-only">
      👈 Se dine vin(n), trykk på navnet ditt
    </div>
  </div>
</template>

<script>

import { highscoreStatistics } from "@/api";
import { humanReadableDate, daysAgo } from "@/utils";
import Wine from "@/ui/Wine";

export default {
  components: { Wine },
  data() {
    return {
      highscore: [],
      filterInput: ''
    }
  },
  async mounted() {
    let response = await highscoreStatistics();
    response.sort((a, b) => {
      return a.wins.length > b.wins.length ? -1 : 1;
    });
    response = response.filter(
      person => person.name != null && person.name != ""
    );
    this.highscore = this.generateScoreBoard(response);
  },
  computed: {
    filteredResults() {
      let highscore = this.highscore;
      let val = this.filterInput;

      if (val.length) {
        val = val.toLowerCase()
        const nameIncludesString = (person) => person.name.toLowerCase().includes(val);
        highscore = highscore.filter(nameIncludesString)
      }

      return highscore
    }
  },
  methods: {
    generateScoreBoard(highscore=this.highscore) {
      let place = 0;
      let highestWinCount = -1;

      return highscore.map(win => {
        const wins = win.wins.length
        if (wins != highestWinCount) {
          place += 1
          highestWinCount = wins
        }

        const placeString = place.toString().padStart(2, "0");
        win.rank = placeString;
        return win
      })
    },
    resetFilter() {
      this.filterInput = '';
      document.getElementsByTagName('input')[0].focus();
    },
    selectWinner(winner) {
      const path = "/highscore/" + encodeURIComponent(winner.name)
      this.$router.push(path);
    },
    humanReadableDate: humanReadableDate,
    daysAgo: daysAgo
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries.scss";
@import "./src/styles/variables.scss";
$elementSpacing: 3.5rem;

.el-spacing {
  margin-bottom: $elementSpacing;
}

.filter input {
  font-size: 1rem;
  width: 30%;
  border-color: black;
  border-width: 1.5px;
  padding: 0.75rem 1rem;
}

.highscore-header {
  margin-bottom: 2rem;
  font-size: 1.3rem;
  color: $matte-text-color;
}

.highscore-list {
  display: flex;
  flex-direction: column;
  padding-left: 0;

  li {
    width: intrinsic;
    display: inline-block;
    margin-bottom: calc(1rem - 2px);
    font-size: 1.25rem;
    color: $matte-text-color;
    cursor: pointer;

    border-bottom: 2px solid transparent;
    &:hover, &:focus {
      border-color: $link-color;
    }
  }
}

.center {
  position: absolute;
  top: 40%;
  right: 10vw;
  max-width: 50vw;

  font-size: 2.5rem;
  background-color: $primary;
  padding: 1rem 1rem;
  border-radius: 8px;
  font-style: italic;

  @include widescreen {
    right: 20vw;
  }
}
</style>
