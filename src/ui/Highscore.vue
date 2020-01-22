<template>
  <div v-if="highscore.length > 0">
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
    this.highscore = response;
  }
};
</script>

<style lang="scss" scoped>
div {
  margin: 15px 0 0 0;
  font-family: "knowit";
  display: inline-flex;
  flex-direction: column;
}
</style>
