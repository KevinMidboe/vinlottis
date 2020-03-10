<template>
  <div class="outer">
    <h2>Vinlottis brukerregistering</h2>
    <form aria-label="User registration" @submit.prevent>
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

      <button class="vin-button" @click="submit">Registrer bruker</button>

      <div v-if="error" class="error">{{ error }}</div>
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
    submit() {
      register(this.username, this.password)
        .then(resp => this.$router.push("/"))
        .catch(error => this.error = error.message || error)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/loginAndRegister";
</style>
