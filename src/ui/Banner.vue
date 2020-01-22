<template>
  <router-link to="/">
    <div class="top-banner">
      <img src="/public/assets/images/knowit.svg" />
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
@import "../styles/media-queries.scss";

.top-banner {
  text-align: center;
  width: 100vw;
  margin-top: 0px;
  padding: 33px 0;
  background-color: #dbeede;
  -webkit-box-shadow: 0px 0px 22px -8px rgba(0,0,0,0.65);
  -moz-box-shadow: 0px 0px 22px -8px rgba(0,0,0,0.65);
  box-shadow: 0px 0px 22px -8px rgba(0,0,0,0.65);

  @include mobile {
    padding: 20px 0;

    > img {
      height: 23px;
    }
  }
}
</style>