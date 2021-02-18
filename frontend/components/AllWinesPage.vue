<template>
  <div class="container">
    <h1 class="">Alle viner</h1>

    <div class="wines-container">
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
                <router-link class="vin-link" :to="winDateUrl(wine.dates[index])">{{
                  dateString(wine.dates[index])
                }}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </Wine>
    </div>
  </div>
</template>

<script>
import Wine from "@/ui/Wine";
import { dateString } from "@/utils";

export default {
  components: { Wine },
  data() {
    return {
      wines: []
    };
  },
  mounted() {
    this.overallWineStatistics();
  },
  methods: {
    winDateUrl(date) {
      const timestamp = new Date(date).getTime();
      return `/history/${timestamp}`;
    },
    overallWineStatistics() {
      return fetch("/api/wines")
        .then(resp => resp.json())
        .then(response => (this.wines = response.wines));
    },
    dateString: dateString
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries";
@import "@/styles/variables";

.container {
  width: 90vw;
  margin: 3rem auto;
  margin-bottom: 0;
  padding-bottom: 4rem;
}

h1 {
  font-size: 3rem;
  font-family: "knowit";
  font-weight: normal;

  font-family: knowit, Arial;
  margin-bottom: 25px;
}

.label {
  font-weight: 600;
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
