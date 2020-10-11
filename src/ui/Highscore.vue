<template>
  <div class="highscores" v-if="highscore.length > 0">
    <h3>
      <router-link to="highscore">
        Topp 10 vinnere <span class="vin-link">Se alle &gt;</span>
      </router-link>
    </h3>
    <ol>
      <li v-for="person in highscore" :key="person">
        <b>{{ person.rank }}.</b> {{ person.name }} - {{ person.wins.length }}
      </li>
    </ol>
  </div>
</template>

<script>

import { highscoreStatistics } from "@/api";

export default {
  data() {
    return { highscore: [] };
  },
  async mounted() {
    let response = await highscoreStatistics();
    response.sort((a, b) => a.wins.length < b.wins.length ? 1 : -1)
    this.highscore = this.generateScoreBoard(response.slice(0, 10));
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
div {
  margin: 0;
  font-family: Arial;
  display: inline-flex;
  flex-direction: column;
}

h3 {
  text-align: left;

  & a {
    text-decoration: none;
    color: #333333;

    &:focus,
    &:active,
    &:visited {
      text-decoration: none;
      color: #333333;
    }
  }
}

ol {
  padding-left: 1.375rem !important;
  margin-left: 0;
  margin: 0 0 1.5em;
  padding: 0;
  counter-reset: item;
  & > li {
    padding: 2.5px 0;
    margin: 0 0 0 -1.25rem;
    list-style-type: none;

    @include mobile {
      padding: 5px 0;
    }
  }
}
</style>
