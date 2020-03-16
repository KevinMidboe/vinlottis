<template>
  <div>
    <h1>Admin-side</h1>
    <div class="tab-container">
      <div
        class="tab"
        @click="changeTab(0)"
        :class="chosenTab == 0 ? 'active' : null"
      >
        Registrering
      </div>
      <div
        class="tab"
        @click="changeTab(1)"
        :class="chosenTab == 1 ? 'active' : null"
      >
        Virtuelt lotteri
      </div>
    </div>
    <div class="tab-elements">
      <RegisterPage :class="chosenTab == 0 ? null : 'hide'" />
      <VirtualLotteryRegistrationPage :class="chosenTab == 1 ? null : 'hide'" />
    </div>
  </div>
</template>

<script>
import RegisterPage from "@/components/RegisterPage";
import VirtualLotteryRegistrationPage from "@/components/VirtualLotteryRegistrationPage";

export default {
  components: {
    RegisterPage,
    VirtualLotteryRegistrationPage
  },
  data() {
    return {
      chosenTab: 0
    };
  },
  methods: {
    changeTab: function(num) {
      this.chosenTab = num;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
.hide {
  display: none;
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
  /* height: 60px; */
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
