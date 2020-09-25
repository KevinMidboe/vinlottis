<template>
  <div v-if="wines.length > 0">
    <h3>
      <router-link to="viner"
        >Topp 10 viner <span class="vin-link">Se alle &gt;</span></router-link
      >
    </h3>
    <ol class="list-container">
      <li v-for="(wine, index) in wines" :key="wine" class="single-item">
        <span class="wine-occurences">{{ index + 1}}.</span>
        <span class="wine-name">{{ wine.name }}</span>
        <span class="wine-win-info"> {{ wine.occurences }} {{amount(wine.occurences)}}</span>
        <a
          class="wine-link"
          :href="wine.vivinoLink"
          >Les mer</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { event } from "vue-analytics";
import Wine from "@/ui/Wine";
import { overallWineStatistics } from "@/api";

export default {
  components: {
    Wine
  },
  data() {
    return { wines: [], clickedWine: null, wineOpen: false };
  },
  async mounted() {
    let response = await overallWineStatistics();

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
    this.wines = response.slice(0, 10);
  },
  methods: {
    amount(occurences){
      return occurences > 1 ? "ganger" : "gang";
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
@import "./src/styles/variables.scss";
@import "./src/styles/global.scss";
@import "../styles/media-queries.scss";

h3 {
  & a {
    text-decoration: none;
    color: #333333;
  }
}

.list-container{
  display: grid;
  grid: auto-flow min-content / 1fr;
  row-gap: 5px;
  padding: 0; 

  .single-item{
    display: grid;
    grid: 1fr / .1fr 1fr .3fr .3fr;

    .wine-occurences{
      font-weight: bold;
    }

    .wine-name{
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .wine-link {
      color: #333333;
      text-decoration: underline 1px solid $link-color;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
