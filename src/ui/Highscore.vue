<template>
  <div class="highscores" v-if="highscore.length > 0">
    <h3>Highscore</h3>
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
.highscores {
  padding-right: 50px;
}
div {
  margin: 15px 0 0 0;
  font-family: Arial;
  display: inline-flex;
  flex-direction: column;
}
ol {
  padding-left: 1.375rem !important;
  margin-left: 0;

  li {
    padding: 2.5px 0;
    width: max-content;
  }
}
</style>
