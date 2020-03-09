<template>
  <div class="outer">
    <h2>Vinlottis brukerinnlogging</h2>
    <form aria-label="User signin" @submit.prevent>
      <div class="label-div">
        <label>Brukernavn</label>
        <input type="text" v-model="username" placeholder="Brukernavn" @keyup.enter="login" />
      </div>
      <div class="label-div row">
        <label>Passord</label>
        <input type="password" v-model="password" placeholder="Passord" @keyup.enter="login" />
      </div>

      <button class="vin-button" @click="login">Logg inn</button>

      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>
<script>
import { login } from "@/api";

export default {
  data() {
    return {
      username: undefined, 
      password: undefined,
      error: undefined
    }
  },
  methods: {
    login() {
      login(this.username, this.password)
        .then(resp => {
          if (resp.redirected) { this.$router.push("update") }
        })
        .catch(this.loginErrorResponse)

    },
    loginErrorResponse(error) {
      this.error = error.message || error
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/loginAndRegister";
</style>
