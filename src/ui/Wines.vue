<template>
  <div v-if="wines.length > 0">
    <h3>
      <router-link to="viner"
        >Topp 10 viner <span class="link">Se alle &gt;</span></router-link
      >
    </h3>
    <ol>
      <li v-for="(wine, index) in wines" :key="wine">
        <div class="inline-wine-name">
          <span class="truncate">
            <span class="increment">{{ index + 1}}.</span>{{ wine.name }}
          </span>
        </div>
        <span class="wine-win-info">{{ wine.rating ? wine.rating + "/5" : wine.price + " kr"}}
          - {{ wine.occurences }} gang(er)
        </span>
        <a
          class="wine-link"
          :href="wine.vivinoLink"
          @click="wineClick(wine, $event)"
          >Les mer</a>
      </li>
    </ol>
    <div class="wine-window-outer" v-if="wineOpen" @click="closeWine">
      <div class="wine-window">
        <Wine :wine="clickedWine" :fullscreen="true" />
        <div class="close-modal" @click="closeWine">X</div>
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
    closeWine: function(event) {
      if (
        event.toElement.className.includes("wine-window-outer") ||
        event.toElement.className.includes("close-modal")
      ) {
        this.clickedWine = null;
        this.wineOpen = false;
      }
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
.wine-window-outer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #000000aa;
  top: 0;
  left: 0;
}
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
    width: 80vw;
  }

  > *:first-child {
    display: flex;
  }
}

.link {
  font-weight: bold;
  border-bottom: 1px solid #ff5fff;
  font-size: 1rem;
  margin-left: 15px;
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

ol {
  margin-left: 0;
  margin: 0 0 1.5em;
  padding: 0;
  & > li {
    margin: 0 0 0.5rem - 1.25rem;
    margin: 0;
    padding: 0;
    list-style-type: none;

    display: flex;
    justify-content: space-between;

    @media (max-width: 1080px) {
      padding: 5px 0;
      margin-bottom: 0.3rem;
      flex-wrap: wrap;
      justify-content: unset;
    }
  }

  @include desktop {
    padding-left: 1rem !important;
  }
}

.inline-wine-name {
  display: inline-flex;
  padding: 0;
  flex-grow: 1;
  max-width: 420px;

  .increment {
    font-weight: 600;
    margin-right: 0.5rem;
  }

  @media (max-width: 1080px) {
    width: 100%;
    max-width: 75vw;
  }
}

.wine-win-info {
  margin-right: 0.75rem;
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
