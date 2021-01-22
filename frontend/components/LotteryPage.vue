<template>
  <div>
    <Tabs :tabs="tabs" :active="startRoute" v-on:tabChange="tabChanged" />
  </div>
</template>

<script>
import Tabs from "@/ui/Tabs";
import GeneratePage from "@/components/GeneratePage";
import VirtualLotteryPage from "@/components/VirtualLotteryPage";

export default {
  components: {
    Tabs
  },
  data() {
    return {
      startRoute: 0
    };
  },
  beforeMount() {
    switch (this.$router.currentRoute.params.tab) {
      case "generate":
        this.startRoute = 0;
        break;
      case "game":
        this.startRoute = 1;
        break;
      default:
        this.startRoute = 0;
    }
  },
  data() {
    return {
      tabs: [
        { name: "Loddgenerator", component: GeneratePage },
        { name: "Virtuelt lotteri", component: VirtualLotteryPage }
      ]
    };
  },
  methods: {
    tabChanged: function(num) {
      if (num == 0) {
        this.$router.push("/lottery/generate");
      } else if (num == 1) {
        this.$router.push("/lottery/game");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
