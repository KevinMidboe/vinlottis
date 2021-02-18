<template>
  <section>
    <h2>{{ title ? title : "Vinnere" }}</h2>
    <div class="winning-raffles" v-if="winners.length > 0">
      <div v-for="(winner, index) in winners" :key="index">
        <router-link :to="`/highscore/${winner.name}`">
          <div :class="winner.color + '-raffle'" class="raffle-element">{{ winner.name }}</div>
        </router-link>
      </div>
    </div>

    <div v-else-if="drawing" class="container">
      <h3>Trekningen er igang!</h3>
    </div>

    <div v-else class="container">
      <h3>Trekningen har ikke startet enda <button>⏰</button></h3>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    winners: {
      type: Array
    },
    drawing: {
      type: Boolean
    },
    title: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

section {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
  width: 100%;
  text-align: center;
}

h3 {
  margin: auto;
  color: $matte-text-color;
  font-size: 1.6rem;
  text-align: center;
}

.winning-raffles {
  display: flex;
  flex-flow: wrap;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.raffle-element {
  font-size: 1rem;
  width: 145px;
  height: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
}

.container {
  display: flex;
  height: 100%;

  button {
    -webkit-appearance: unset;
    background-color: unset;
    padding: 0;
    margin: 0;
    font-size: inherit;
    border: unset;
    height: auto;
    width: auto;
    cursor: pointer;
  }
}
</style>
