<template>
  <div v-if="wines.length > 0">
    <h3>Topp viner</h3>
    <ol>
      <li v-for="wine in wines">
        <span v-if="wine.vivinoLink == '' || wine.vivinoLink == null">
          {{ wine.name }} - sett {{ wine.occurences }} ganger,
          {{ wine.rating }} i rating
        </span>
        <a
          class="wine-link"
          :href="wine.vivinoLink"
          v-if="wine.vivinoLink != '' && wine.vivinoLink != null"
          @click="wineClick(wine)"
        >
          <span class="truncate">{{ wine.name }}</span> - {{ wine.rating }} i
          rating - {{ wine.occurences }} gang(er)
        </a>
      </li>
    </ol>
  </div>
</template>

<script>
import { event } from "vue-analytics";
export default {
  data() {
    return { wines: [] };
  },
  async mounted() {
    let _response = await fetch("/api/wines/statistics");
    let response = await _response.json();

    response.sort();
    response = response
      .filter(wine => wine.name != null && wine.name != "")
      .sort((a, b) => (a.occurences > b.occurences ? -1 : 1));
    this.wines = response.slice(0, 5);
  },
  methods: {
    wineClick: function(wine) {
      if (window.location.hostname == "localhost") {
        return;
      }
      this.$ga.event({
        eventCategory: "Wines",
        eventAction: "click",
        eventValue: `${wine.name} - ${wine.vivinoLink}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  text-align: left;
}
div {
  margin: 15px 0 0 0;
  font-family: arial;
  display: inline-flex;
  flex-direction: column;
}

a {
  text-decoration: none;
  color: #ff5b23;
  padding: 2.5px 0;
}

ol {
  padding-left: 1rem;
  margin-left: 0;
}

.wine-link {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.truncate {
  display: inline-block;
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
