<template>
  <div class="outer">
    <div class="container">
      <h1 class="title">Alle viner</h1>
      <div class="wines-container">
        <Wine :wine="wine" v-for="wine in wines" :key="wine" :fullscreen="true" :inlineSlot="true">
          <div class="winners-container">
            <div class="name-wins" v-if="wine.winners">
              <span class="label">Vunnet av:</span>
              <span class="names" v-for="winner in wine.winners">- {{ winner }}</span>
              </span>
            </div>
            <div class="color-wins" :class="{ 'big': fullscreen }"
              v-if="wine.blue || wine.red || wine.green || wine.yellow">
              <span class="label">Vinnende lodd:</span>
              <span class="color-win blue">{{wine.blue == undefined ? 0 : wine.blue}}</span>
              <span class="color-win red">{{wine.red == undefined ? 0 : wine.red}}</span>
              <span class="color-win green">{{wine.green == undefined ? 0 : wine.green}}</span>
              <span class="color-win yellow">{{wine.yellow == undefined ? 0 : wine.yellow}}</span>
            </div>
          </div>
        </Wine>
      </div>
    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import Banner from "@/ui/Banner";
import Wine from "@/ui/Wine";
import { overallWineStatistics } from "@/api";

export default {
  components: {
    Banner,
    Wine
  },
  data() {
    return {
      wines: []
    };
  },
  async mounted() {
    const wines = await overallWineStatistics();
    this.wines = wines.sort((a, b) =>
      a.rating > b.rating ? -1 : 1
    );
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";

h1 {
  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.wines-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 0 2rem;

  @media(min-width: 1500px) {
    max-width: 1500px;
    margin: 0 auto;
  }

  @include mobile {
    flex-direction: column;
  }
}

.winners-container {
  display: flex;
  flex-direction: column;

  @include mobile {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
}

.label {
  margin-bottom: 0.25rem;
  font-weight: 600;
  width: 100%;
}

.name-wins {
  display: flex;
  flex-direction: column;


  .names {
    margin-left: 0.5rem;
  }
}

.color-wins {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;

  margin-left: -3px;   // offset span.color-win margin

  @include mobile {
    width: 25vw;
    margin-left: -2px; // offset span.color-win margin
  }
  @include desktop {
    margin-top: 1rem;
  }
}

.color-wins.big {
  width: unset;
}

span.color-win {
  border: 2px solid transparent;
  color: #333;
  display: block;
  padding: 25px;
  font-size: 1.3rem;
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: row;
  /* max-height: calc(3rem + 18px); */
  /* max-width: calc(3rem + 18px); */
  width: 1rem;
  margin: 3px;
  touch-action: manipulation;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;

  @include mobile {
    margin: 2px;
    padding: 10px;
    font-size: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
    grow: 0.5;
  }

  &.green {
    background: #c8f9df;
  }
  &.blue {
    background: #d4f2fe;
  }
  &.red {
    background: #fbd7de;
  }
  &.yellow {
    background: #fff6d6;
  }
}
</style>
