<template>
  <div>
    <h1 class="text-center">Vinlottis highscore 🏆🍷</h1>
    
    <div class="content-container">
      <div class="highscore">        
        <div>
          <h3 >Finn ditt navn:</h3>
          <input type="text" v-model="highscoreFilter" placeholder="Filtrer på navn" class="margin-bottom-sm" />
        </div>
        
        <ol v-if="highscore.length > 0">
          <li v-for="person in highscore" :key="person" @click="selectWinner(person)">
            {{ person.name }} - {{ person.wins.length }}
          </li>
        </ol>

        <div v-if="highscore.length != highscoreResponse.length" class="flex justify-center align-center">
          <i @click="resetFilter" @keyup.space="resetFilter"
             role="button" aria-pressed="false" tabindex="0">reset filter</i>
        </div>
      </div>

      <div class="winners-vines" v-if="selectedWinner">
        <h1>{{ selectedWinner.name }}</h1>

        <h2>Vinnende farger:</h2>
        <div class="winning-colors">
          <div v-for="win in selectedWinner.wins"
               class="color-box" :class="win.color"
               :style="{ transform: 'rotate(' + getRotation() + 'deg)' }">
          </div>
        </div>

        <h2>Flasker vunnet:</h2>
        <div v-for="win in selectedWinner.wins" class="single-win">
          <div class="date-won"><b>{{ humanReadableDate(win.date) }}</b> - {{ daysAgo(win.date) }} dager siden</div>
          <br/>
          <div class="left">
            <h3>Vunnet med:</h3>
            
            <div class="color-box" :class="win.color"
                  :style="{ transform: 'rotate(' + getRotation() + 'deg)' }"></div>
          </div>
          <div class="left">
            <Wine :wine="win.wine"></Wine>
          </div>
        </div>
      </div>

      <div v-else class="center">
        <h1>👈 Se dine vinn, trykk på navnet ditt</h1>
      </div>
    </div>
  </div>
</template>

<script>

import { highscoreStatistics } from "@/api";
import { humanReadableDate, daysAgo } from "@/utils";
import Wine from "@/ui/Wine";

export default {
  components: { Wine },
  data() {
    return {
      highscoreResponse: [],
      highscore: [],
      highscoreFilter: '',
      selectedWinner: null
    }
  },
  async mounted() {
    let response = await highscoreStatistics();
    response.sort((a, b) => {
      return a.wins.length > b.wins.length ? -1 : 1;
    });
    response = response.filter(
      person => person.name != null && person.name != ""
    );
    this.highscoreResponse = response
    this.highscore = this.highscoreResponse;
  },
  watch: {
    highscoreFilter(val) {
      if (val.length) {
        val = val.toLowerCase();
        this.highscore = this.highscoreResponse.filter(person => person.name.toLowerCase().includes(val))
      } else {
        this.highscore = this.highscoreResponse
      }
    }
  },
  methods: {
    humanReadableDate: humanReadableDate,
    daysAgo: daysAgo,
    resetFilter() {
      this.highscore = this.highscoreResponse;
      this.highscoreFilter = '';
      document.getElementsByTagName('input')[0].focus();
    },
    selectWinner(winner) {
      if (this.selectedWinner != null && this.selectedWinner["name"] == winner["name"]) {
        this.selectedWinner = null;
      } else {
        let newestFirst = winner.wins.sort((a, b) => a.date < b.date);
        winner.wins = newestFirst;
        this.selectedWinner = { ...winner };
      }
    },
    getRotation: function() {
      let num = Math.floor(Math.random() * 12.5);
      let neg = Math.floor(Math.random() * 2);
      return neg == 0 ? -num : num;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
@import "../styles/variables.scss";

h1 {
  text-align: center;
}

input[type="text"] {
    width: 100%;
    color: black;
    border-radius: 4px;
    padding: 1rem 1rem;
    border: 1px solid black;
    max-width: 200px;
}

.date-won {
  font-size: 1.3rem;
  margin-top: 2rem;
}

.color-box {
  width: 100px;
  height: 100px;
  margin: 10px;
  -webkit-mask-image: url(/../../public/assets/images/lodd.svg);
  background-repeat: no-repeat;
  mask-image: url(/../../public/assets/images/lodd.svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  @include mobile {
    width: 60px;
    height: 60px;
    margin: 10px;
  }
}

.single-win {
  border-bottom: 1px solid rgb(237, 237, 237);
  .left {
    display: flex;
    align-items: center;
  }
}

.green {
  background-color: $light-green;
}

.blue {
  background-color: $light-blue;
}

.yellow {
  background-color: $light-yellow;
}

.red {
  background-color: $light-red;
}

.content-container {
  display: flex;
  flex-direction: column-reverse;
  margin: 2em;

  .center {
    align-self: center;
    h1 {
      background-color: $primary;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-style: italic;
    }
  }

  .winning-colors {
    display: flex;
  }

  @include mobile {
    .center {
      display: none;
    }
  }

  @include tablet {
    display: grid;
    grid-template-columns: .3fr 1fr;
    grid-template-rows: auto-flow min-content;
    justify-items: center;
    width: 80%;
    margin: auto;
    grid-gap: 1em;
    max-width: 1600px;
  }
}

ol {
  padding-left: 1.375rem !important;
  margin-left: 0;
  margin: 0 0 1.5em;
  padding: 0;
  counter-reset: item;
  & > li {
    cursor: pointer;
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
