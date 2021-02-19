<template>
  <div v-if="wines.length > 0" class="wines-main-container">
    <div class="info-and-link">
      <h3>
        Topp viner
      </h3>
      <router-link to="viner">
        <span class="vin-link">Se alle viner </span>
      </router-link>
    </div>
    <div class="wines-container">
      <Wine v-for="wine in wines" :key="wine" :wine="wine">
        <template v-slot:top>
          <div class="flex justify-end">
            <div class="requested-count cursor-pointer">
              <span> {{ wine.occurences }} </span>
              <i class="icon icon--heart" />
            </div>
          </div>
        </template>
      </Wine>
    </div>
  </div>
</template>

<script>
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
      limit: 18
    };
  },
  async mounted() {
    this.getAllWines();
  },
  methods: {
    getAllWines() {
      return fetch(`/api/wines?limit=${this.limit}`)
        .then(resp => resp.json())
        .then(response => {
          let { wines, success } = response;

          this.wines = wines.sort(
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
        });
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
@import "@/styles/variables.scss";
@import "@/styles/global.scss";
@import "@/styles/media-queries.scss";

.wines-main-container {
  margin-bottom: 10em;
}

.info-and-link {
  display: flex;
  justify-content: space-between;
}

.requested-count {
  display: flex;
  align-items: center;
  margin-top: -0.5rem;
  background-color: rgb(244, 244, 244);
  border-radius: 1.1rem;
  padding: 0.25rem 1rem;
  font-size: 1.25em;

  span {
    padding-right: 0.5rem;
    line-height: 1.25em;
  }
  .icon--heart {
    font-size: 1.5rem;
    color: var(--link-color);
  }
}

// Call for help
.wines-container {
  @media (max-width: 1643px) {
    *:nth-child(n + 7) {
      display: none;
    }
  }

  @media (max-width: 2066px) {
    *:nth-child(n + 9) {
      display: none;
    }
  }

  @media (max-width: 2490px) {
    *:nth-child(n + 11) {
      display: none;
    }
  }

  @media (max-width: 2915px) {
    *:nth-child(n + 13) {
      display: none;
    }
  }

  @media (max-width: 3335px) {
    *:nth-child(n + 15) {
      display: none;
    }
  }

  @media (max-width: 3758px) {
    *:nth-child(n + 17) {
      display: none;
    }
  }
}
</style>
