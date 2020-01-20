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
    let _response = await fetch(
      "/api/highscore/statistics"
    );
    let response = await _response.json();
    this.highscore = response;
  }
};
</script>

<style lang="scss" scoped>
div {
  font-family: sans-serif;
  width: 70vw;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
