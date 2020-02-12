<template>
  <div v-if="wines.length > 0">
    <h3>
      <router-link to="viner">Topp 5 viner</router-link>
    </h3>
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
          @click="wineClick(wine, $event)"
        >Les mer</a>
      </li>
    </ol>
    <div class="wine-window" v-if="wineOpen">
      <div class="close-modal" @click="closeWine">X</div>
      <Wine :wine="clickedWine" />
    </div>
  </div>
</template>

<script>
import { event } from "vue-analytics";
import Wine from "@/ui/Wine";

export default {
  components: {
    Wine
  },
  data() {
    return { wines: [], clickedWine: null, wineOpen: false };
  },
  async mounted() {
    let _response = await fetch("/api/wines/statistics/overall");
    let response = await _response.json();

    response.sort();
    response = response
      .filter(wine => wine.name != null && wine.name != "")
      .sort(
        this.predicate(
          {
            name: "occurences",
            reverse: true
          },
          {
            name: "rating",
            reverse: true
          }
        )
      );
    this.wines = response.slice(0, 5);
  },
  methods: {
    wineClick: function(wine, event) {
      event.preventDefault();
      this.clickedWine = wine;
      this.wineOpen = true;

      if (window.location.hostname == "localhost") {
        return;
      }
      this.$ga.event({
        eventCategory: "Wines",
        eventAction: "click",
        eventValue: `${wine.name} - ${wine.vivinoLink}`
      });
    },
    closeWine: function() {
      this.clickedWine = null;
      this.wineOpen = false;
    },

    predicate: function() {
      var fields = [],
        n_fields = arguments.length,
        field,
        name,
        cmp;

      var default_cmp = function(a, b) {
          if (a == undefined) a = 0;
          if (b == undefined) b = 0;
          if (a === b) return 0;
          return a < b ? -1 : 1;
        },
        getCmpFunc = function(primer, reverse) {
          var dfc = default_cmp,
            // closer in scope
            cmp = default_cmp;
          if (primer) {
            cmp = function(a, b) {
              return dfc(primer(a), primer(b));
            };
          }
          if (reverse) {
            return function(a, b) {
              return -1 * cmp(a, b);
            };
          }
          return cmp;
        };

      // preprocess sorting options
      for (var i = 0; i < n_fields; i++) {
        field = arguments[i];
        if (typeof field === "string") {
          name = field;
          cmp = default_cmp;
        } else {
          name = field.name;
          cmp = getCmpFunc(field.primer, field.reverse);
        }
        fields.push({
          name: name,
          cmp: cmp
        });
      }

      // final comparison function
      return function(A, B) {
        var name, result;
        for (var i = 0; i < n_fields; i++) {
          result = 0;
          field = fields[i];
          name = field.name;

          result = field.cmp(A[name], B[name]);
          if (result !== 0) break;
        }
        return result;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";
.wine-window {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  position: fixed;
  width: 95vw;
  height: 95vh;
  background: white;
  border: 1px solid #3333333a;
  display: flex;
  justify-content: center;
  align-items: center;
  @include desktop {
    width: 60vw;
  }
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
}

h3 {
  text-align: left;

  & a {
    text-decoration: none;
    color: #333333;

    &:focus,
    &:active,
    &:visited {
      text-decoration: none;
      color: #333333;
    }
  }
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
  cursor: pointer;
  border-bottom: 1px solid #ff5fff;
}

.truncate {
  display: inline-block;
  max-width: 350px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
