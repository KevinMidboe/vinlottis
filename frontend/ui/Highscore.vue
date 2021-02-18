<template>
  <div class="highscores" v-if="highscore.length > 0">
    <section class="heading">
      <h3>
        Topp vinnere
      </h3>
      <router-link to="highscore" class="">
        <span class="vin-link">Se alle vinnere</span>
      </router-link>
    </section>

    <ol class="winner-list-container">
      <li v-for="(person, index) in highscore" :key="person._id">
        <router-link :to="`/highscore/${person.name}`" class="single-winner">
          <span class="placement">{{ index + 1 }}.</span>
          <i class="icon icon--medal"></i>
          <p class="winner-name">{{ person.name }}</p>
        </router-link>
      </li>
    </ol>
  </div>
</template>

<script>
import { highscoreStatistics } from "@/api";

export default {
  data() {
    return {
      highscore: [],
      limit: 22
    };
  },
  async mounted() {
    return fetch(`/api/history/by-wins?limit=${limit}`)
      .then(resp => resp.json())
      .then(response => {
        this.highscore = response.winners;
      });
  }
};
</script>

<style lang="scss" scoped>
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
  grid-template-columns: repeat(auto-fit, minmax(12.5em, 1fr));
  gap: 5%;

  .single-winner {
    box-sizing: border-box;
    width: 100%;
    background: $primary;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 1em; 

    i {
      font-size: 3em;
      width: max-content;
      justify-self: end;
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
