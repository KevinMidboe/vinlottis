<template>
  <div class="outer">
    <div>
      <h2>Vinlottis</h2>
      <form method="post" action="/register">
        <input type="text" name="username" placeholder="Brukernavn" />
        <input type="password" name="password" placeholder="Passord" />
        <input type="submit" value="registrer bruker" />
      </form>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/media-queries.scss";
div {
  font-family: Arial;
}
.outer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
h2 {
  width: 100vw;
  text-align: center;
  font-size: 3rem;
  font-family: knowit, Arial;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
}

input {
  margin: 20px;
  width: 30vw;
  font-size: 3rem;
  border: none;
  border-bottom: 1px solid black;
}

input[type="submit"] {
  border: 1px solid black;
}
</style>
