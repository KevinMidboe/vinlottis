<template>
  <div>
    <h1>Admin-side</h1>
    <Tabs :tabs="tabs" />
  </div>
</template>

<script>
import Tabs from "@/ui/Tabs";
import RegisterPage from "@/components/RegisterPage";
import VirtualLotteryRegistrationPage from "@/components/VirtualLotteryRegistrationPage";

export default {
  components: {
    Tabs,
    RegisterPage,
    VirtualLotteryRegistrationPage
  },
  data() {
    return {
      tabs: [
        { name: "Registrering", component: RegisterPage },
        { name: "Virtuelt lotteri", component: VirtualLotteryRegistrationPage }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
