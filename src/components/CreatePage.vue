<template>
  <div class="outer">
    <h2>Vinlottis brukerregistering</h2>
    <form aria-label="User registration" @submit.prevent>
      <div class="label-div">
        <label>Brukernavn</label>
        <input type="text" v-model="username" placeholder="Brukernavn" @keyup.enter="login" />
      </div>
      <div class="label-div row">
        <label>Passord</label>
        <input type="password" v-model="password" placeholder="Passord" @keyup.enter="login" />
      </div>

      <button class="vin-button" @click="register">Registrer bruker</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
<script>
import { register } from "@/api";

export default {
  data() {
    return {
      username: undefined,
      password: undefined,
      error: undefined
    }
  },
  methods: {
    register() {
      register(this.username, this.password)
        .then(resp => {
          if (resp.redirected) { this.$router.push("/") }
        })
        .catch(this.registerErrorResponse)

    },
    registerErrorResponse(error) {
      console.log("error", error)
      this.error = error.message || error
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/loginAndRegister";
</style>
