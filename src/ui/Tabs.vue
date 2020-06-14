<template>
  <div>
    <div class="tab-container">
      <div
        class="tab"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="changeTab(index)"
        :class="chosenTab == index ? 'active' : null"
      >{{ tab.name }}</div>
    </div>
    <div class="tab-elements">
      <component :is="tabs[chosenTab].component" />
    </div>
  </div>
</template>

<script>
import eventBus from "@/mixins/EventBus";
export default {
  props: {
    tabs: {
      type: Array
    },
    active: {
      type: Number,
      default: 0
    }
  },
  beforeMount() {
    this.chosenTab = this.active;
  },
  data() {
    return {
      chosenTab: 0
    };
  },
  methods: {
    changeTab: function(num) {
      this.chosenTab = num;
      this.$emit("tabChange", num);
      eventBus.$emit("tab-change");
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}

.tab-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
  border-bottom: 1px solid #333333;
}

.tab {
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 0 15px;
  border: 1px solid #333333;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: #00000008;
  border-bottom: 1px solid #333333;
  margin-bottom: -1px;

  &.active {
    border-bottom: 1px solid white;
    background: white;
  }
}
</style>
