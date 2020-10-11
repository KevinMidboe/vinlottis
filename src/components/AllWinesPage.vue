<template>
  <div class="container">
    <h1 class="">Alle viner</h1>

    <div id="wines-container">
      <Wine :wine="wine" v-for="(wine, _, index) in wines" :key="wine._id">
        <div class="winners-container">

          <span class="label">Vinnende lodd:</span>
          <div class="flex row">
            <span class="raffle-element blue-raffle">{{ wine.blue == null ? 0 : wine.blue }}</span>
            <span class="raffle-element red-raffle">{{ wine.red == null ? 0 : wine.red }}</span>
            <span class="raffle-element green-raffle">{{ wine.green == null ? 0 : wine.green }}</span>
            <span class="raffle-element yellow-raffle">{{ wine.yellow == null ? 0 : wine.yellow }}</span>
          </div>

          <div class="name-wins">
            <span class="label">Vunnet av:</span>
            <ul class="names">
              <li v-for="(winner, index) in wine.winners">
                <router-link class="vin-link" :to="`/highscore/` + winner">{{ winner }}</router-link>
                 -&nbsp;
                <router-link class="vin-link" :to="winDateUrl(wine.dates[index])">{{ dateString(wine.dates[index]) }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </Wine>

    </div>
  </div>
</template>

<script>
import { page, event } from "vue-analytics";
import Banner from "@/ui/Banner";
import Wine from "@/ui/Wine";
import { overallWineStatistics } from "@/api";
import { dateString } from "@/utils";

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
  methods: {
    winDateUrl(date) {
      const timestamp = new Date(date).getTime();
      return `/history/${timestamp}`
    },
    dateString: dateString
  },
  async mounted() {
    this.wines = await overallWineStatistics();
  }
};
</script>

<style lang="scss" scoped>
@import "./src/styles/media-queries";
@import "./src/styles/variables";

.container {
  max-width: unset;
}

#wines-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;

  > div {
    justify-content: flex-start;
  }
}

.winners-container {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  > div:not(:last-of-type) {
    margin-bottom: 1rem;
  }
}

.name-wins {
  display: flex;
  flex-direction: column;

  a {
    font-weight: normal;
    &:not(:hover) {
      border-color: transparent;
    }
  }

  ul {
    padding-left: 0;

    li {
      padding-left: 1.5rem;
      list-style: none;

      &:before {
        content: "- ";
        margin-left: -0.5rem;
      }
    }
  }
}

.raffle-element {
  padding: 1rem;
  font-size: 1.3rem;
  margin: 3px;
}
</style>
