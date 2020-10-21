<template>
  <div v-if="wines.length > 0" class="wines-main-container">
    <div class="info-and-link">
      <h3>
        Topp 5 viner
      </h3>
      <router-link to="viner">
        <span class="vin-link">Se alle viner </span>
      </router-link>
    </div>
    <div class="wine-container">
      <div v-for="wine in wines" :key="wine" class="single-item">
        <!-- <span class="wine-occurences">{{ index + 1}}.</span> -->
        <div class="hearts-container">
          <span>{{wine.occurences}}</span>
          <i class="icon icon--heart"></i>
        </div>
        <img :src="wine.image" class="wine-image">
        <!-- <span class="wine-win-info"> {{ wine.occurences }} {{amount(wine.occurences)}}</span> -->
        <span class="wine-name">{{ wine.name }}</span>
        <!-- <a
          class="wine-link"
          :href="wine.vivinoLink"
          >Les mer</a> -->
      </div>
    </div>
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
    return { 
      wines: [], 
      clickedWine: null, 
    };
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
    this.wines = response.slice(0, 5);
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

.wines-main-container {
  margin-bottom: 10em;
}

.info-and-link{
  display: flex;
  justify-content: space-between;
}


.wine-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 2rem;

  .single-item{
    height: 400px;
    display: grid;
    grid-template-rows: .3fr 1fr .3fr;

    grid-gap: 1em;
    -webkit-box-shadow: 0px 2px 21px -1px rgba(127,127,127,0.5);
    -moz-box-shadow: 0px 2px 21px -1px rgba(127,127,127,0.5);
    box-shadow: 0px 2px 21px -1px rgba(127,127,127,0.5);

    .hearts-container{
      margin: 10px 10px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      justify-self: end;

      width: 80px;
      height: 30px;
      background-color: #f4f4f4;
      border-radius: 20px;

      .icon--heart{
        font-size: 30px;
        color: $link-color;
      }
    }

    .wine-image {
      width: 60px;
      height: 200px;
      align-self: center;
      justify-self: center;
    }

    .wine-name{
      margin-left: 1em;
      margin-right: .5em;
      padding-bottom: 1em;
      font-size: 20px;
    }
  }
}
</style>
