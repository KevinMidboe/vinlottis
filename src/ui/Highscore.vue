<template>
  <div class="highscores" v-if="highscore.length > 0">
    <h3>Topp 5 vinnere</h3>
    <ol>
      <li v-for="person in highscore">
        {{ person.name }} - {{ person.wins.length }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return { highscore: [] };
  },
  async mounted() {
    let _response = await fetch("/api/highscore/statistics");
    let response = await _response.json();
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
div {
  margin: 0;
  font-family: Arial;
  display: inline-flex;
  flex-direction: column;
}

ol {
  padding-left: 1.375rem !important;
  margin-left: 0;
  margin: 0 0 1.5em;
  padding: 0;
  counter-reset: item;
  & > li {
    padding: 2.5px 0;
    width: max-content;
    margin: 0 0 0 -1.25rem;
    padding: 0;
    list-style-type: none;
    counter-increment: item;
    &:before {
      display: inline-block;
      width: 1em;
      padding-right: 0.5rem;
      font-weight: bold;
      text-align: right;
      content: counter(item) ".";
    }

    @include mobile {
      padding: 5px 0;
    }
  }
}
</style>
