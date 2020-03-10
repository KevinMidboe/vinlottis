<template>
  <div class="outer">
    <h2>Vinlottis brukerinnlogging</h2>
    <form aria-label="User signin" @submit.prevent>
      <div class="label-div">
        <label>Brukernavn</label>
        <input type="text"
               v-model="username"
               placeholder="Brukernavn"
               autocapitalize="none"
               @keyup.enter="submit" />
      </div>
      <div class="label-div row">
        <label>Passord</label>
        <input type="password" v-model="password" placeholder="Passord" @keyup.enter="submit" />
      </div>

      <button class="vin-button" @click="submit">Logg inn</button>

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
    submit() {
      login(this.username, this.password)
        .then(resp => this.$router.push("update"))
        .catch(error => this.error = error.message || error)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/loginAndRegister";
</style>
