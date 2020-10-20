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
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  column-gap: 1em;
  row-gap: 1em;
  margin: 0;
  // align-items: baseline;

  .single-winner {
    width: 12.5em;
    background: $primary;
    padding: 1em;
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
    }

    .winner-name {
      grid-row: 2;
      grid-column: 1 / -1;
    }

    .winner-icon {
      grid-row: 1;
      grid-column: 3;
    }
  }
}
</style>
