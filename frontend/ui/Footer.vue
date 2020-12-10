<template>
  <footer>
    <router-link to="/" class="company-logo">
      <img src="/public/assets/images/knowit.svg" alt="knowit logo">
    </router-link>
  </footer>
</template>

<script>
export default {
  name: 'WineFooter'
}
</script>

<style lang="scss" scoped>

footer {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #f4f4f4;
  .company-logo{
    padding: 0 5em 0 0;
    img{
      width: 100px;
    }
  }
}

</style>