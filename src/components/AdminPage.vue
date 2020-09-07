<template>
  <div>
    <h1>Vinlottis admin panel</h1>
    <Tabs :tabs="tabs" />
  </div>
</template>

<script>
import Tabs from "@/ui/Tabs";
import PreLottery from "@/components/RegisterPage";
import VirtualLotteryRegistrationPage from "@/components/VirtualLotteryRegistrationPage";
import SubmitLotteryPage from "@/components/SubmitLotteryPage";

export default {
  components: {
    Tabs,
    PreLottery,
    VirtualLotteryRegistrationPage,
    SubmitLotteryPage
  },
  data() {
    return {
      tabs: [
        { name: "Registrer ✏️", component: PreLottery },
        { name: "Virtuelt lotteri 🍾", component: VirtualLotteryRegistrationPage },
        { name: "Send inn lotteri 📈", component: SubmitLotteryPage }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-family: knowit, Arial;
  margin: 3rem 0;
}
</style>
