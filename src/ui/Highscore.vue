<template>
  <div class="highscores" v-if="highscore.length > 0">

    <section class="heading">
      <h3>
        Topp 5 vinnere
      </h3>
      <router-link to="highscore" class="">
        <span class="vin-link">Se alle vinnere</span>
      </router-link>
    </section>
    <ol class="winner-list-container">
      <li v-for="(person, index) in highscore" :key="person" class="single-winner">
        <span class="placement">{{index + 1}}.</span>
        <i class="icon icon--medal"></i>
        <p class="winner-name">{{ person.name }}</p>
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
    response.sort((a, b) => {
      return a.wins.length > b.wins.length ? -1 : 1;
    });
    response = response.filter(
      person => person.name != null && person.name != ""
    );
    this.highscore = response.slice(0, 5);
    // response.sort((a, b) => a.wins.length < b.wins.length ? 1 : -1)
    // this.highscore = this.generateScoreBoard(response.slice(0, 10));
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
@import "../styles/variables.scss";
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a {
  text-decoration: none;
  color: #333333;

  &:focus,
  &:active,
  &:visited {
    text-decoration: none;
    color: #333333;
  }
}

ol {
  list-style-type: none;
  margin-left: 0;
  padding: 0;
}

.winner-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
  gap: 5%;

  .single-winner {
    width: 100%;
    background: $primary;
    display: grid;
    grid-template: 1fr .3fr / 1fr 1fr 1fr;
    align-items: center;

    i {
      font-size: 3em;
    }

    .placement {
      grid-row: 1;
      grid-column: 1 / 3;
      font-size: 3em;
      margin-left: 5px;
      padding: .2em 0 0 5px;
    }

    .winner-name {
      grid-row: 2;
      grid-column: 1 / -1;
      margin-left: 5px;
      padding-left: 5px;
    }


    .winner-icon {
      grid-row: 1;
      grid-column: 3;
    }
  }
}
</style>
