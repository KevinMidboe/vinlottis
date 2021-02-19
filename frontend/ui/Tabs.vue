<template>
  <div>
    <nav class="tab-container">
      <a
        class="tab"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="changeTab(index)"
        @keydown.enter="changeTab(index)"
        tabindex="0"
        :class="chosenTab == index ? 'active' : null"
      >
        {{ tab.name }}

        <span v-if="tab.counter" class="counter">{{ tab.counter }}</span>
      </a>
    </nav>

    <div class="tab-elements">
      <component :is="tabs[chosenTab].component" @counter="updateCounter" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array
    }
  },
  beforeMount() {
    const url = location.href;

    if (url.includes("tab=")) {
      const tabParameter = url.split("tab=")[1];
      const matchingSlug = this.tabs.findIndex(tab => tab.slug == tabParameter);
      console.log("matchingSlug:", matchingSlug);
      this.chosenTab = matchingSlug;
    }
  },
  data() {
    return {
      chosenTab: 0
    };
  },
  computed: {
    activeTab() {
      return this.tabs[this.chosenTab];
    }
  },
  methods: {
    changeTab(num) {
      this.chosenTab = num;

      let url = location.href;
      const tabParameterIndex = url.indexOf("tab=");

      if (tabParameterIndex > 0) {
        url = url.split("tab=")[0] + `tab=${this.activeTab.slug}`;
      } else {
        url = url + `?tab=${this.activeTab.slug}`;
      }

      window.history.pushState({}, "", url);
    },
    updateCounter(val) {
      this.activeTab.counter = val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/media-queries.scss";

h1 {
  text-align: center;
}

.tab-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // margin-top: 25px;
  border-bottom: 1px solid var(--underlinenav-text);

  margin-top: 2rem;

  @include mobile {
    flex-direction: column;
  }
}

.tab {
  cursor: pointer;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-bottom: 2px solid transparent;
  color: rgba($matte-text-color, 0.9);

  &.active {
    color: $matte-text-color;
    border-color: var(--underlinenav-text-active) !important;
    background: white;
    font-weight: 600;
  }

  &:hover,
  &:focus {
    border-color: var(--underlinenav-text-hover);
    outline: 0;
  }

  & .counter {
    margin-left: 4px;
    box-sizing: border-box;

    display: inline-block;
    min-width: 20px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    text-align: center;
    background-color: rgba(209, 213, 218, 0.5);
    border: 1px solid transparent;
    border-radius: 2em;
  }
}
</style>
