<template>
  <div v-if="wines.length > 0">
    <h3>Topp 5 viner</h3>
    <ol>
      <li v-for="wine in wines">
        <span v-if="wine.vivinoLink == '' || wine.vivinoLink == null">
          {{ wine.name }} - sett {{ wine.occurences }} ganger,
          {{ wine.rating }} i rating
        </span>
        <div class="inline-wine-name">
          <span class="truncate">{{ wine.name }}</span>
        </div>
        - {{ wine.occurences }} gang(er)
        <a
          class="wine-link"
          :href="wine.vivinoLink"
          v-if="wine.vivinoLink != '' && wine.vivinoLink != null"
          @click="wineClick(wine)"
          >Les mer</a
        >
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
      .sort((a, b) => (a.rating > b.rating ? -1 : 1));
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
@import "../styles/media-queries.scss";
h3 {
  text-align: left;
}
div {
  margin: 0;
  font-family: arial;
  display: inline-flex;
  flex-direction: column;
}

ol {
  padding-left: 1.375rem !important;
  margin-left: 0;
  margin: 0 0 1.5em;
  padding: 0;
  counter-reset: item;
  & > li {
    margin: 0 0 0 -1.25rem;
    padding: 0;
    list-style-type: none;
    counter-increment: item;
    &:before {
      display: inline-block;
      width: 1em;
      font-weight: bold;
      text-align: right;
      content: counter(item) ".";
    }

    @include mobile {
      padding: 5px 0;
    }
  }
}

.inline-wine-name {
  display: inline-flex;
  padding: 0;
}

.wine-link {
  color: #333333;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid #ff5fff;
}

.truncate {
  display: inline-block;
  max-width: 350px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    line-break: unset;
    word-break: break-word;
    white-space: normal;
    overflow: auto;
    text-overflow: unset;
  }

  @include mobile {
    max-width: calc(75vw - 177px);

    &:focus {
      line-break: unset;
      word-break: break-word;
      white-space: normal;
      overflow: auto;
      text-overflow: unset;
    }
  }
}
</style>
