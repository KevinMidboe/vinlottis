<template>
  <div>
    <h2 v-if="winners.length > 0"> {{ title ? title : 'Vinnere' }}</h2>
    <div class="winners" v-if="winners.length > 0">
      <div class="winner" v-for="(winner, index) in winners" :key="index">
        <div :class="winner.color + '-ballot'" class="ballot-element">{{ winner.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    winners: {
      type: Array
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

h2 {
  text-align: center;
}

.winners {
  display: flex;
  flex-flow: wrap;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.ballot-element {
  font-size: 1rem;
  width: 145px;
  height: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
}
</style>
