<template>
  <footer>
    <a href="https://github.com/KevinMidboe/vinlottis" class="github">
      <span>Utforsk koden på github</span>
      <img src="/public/assets/images/logo-github.png" alt="github logo" />
    </a>

    <a href="mailto:questions@vinlottis.no" class="mail">
      <span class="vin-link">questions@vinlottis.no</span>
    </a>
  </footer>
</template>

<script>
export default {
  name: "WineFooter",
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/media-queries.scss";

footer {
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f4f4;
  position: fixed;
  bottom: 0;

  > *:first-of-type {
    margin-left: 0.5rem;
  }
  > *:last-of-type {
    margin-right: 0.5rem;
  }

  @include desktop {
    > *:first-of-type {
      margin-left: 4rem;
    }
    > *:last-of-type {
      margin-right: 4rem;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-left: 5rem;

    li:not(:first-of-type) {
      margin-top: 0.75rem;
    }
  }

  a {
    color: $matte-text-color;
  }

  .github {
    display: flex;
    align-items: center;

    img {
      margin-left: 0.5rem;
      height: 30px;
    }
  }

  .mail {
    display: flex;
    align-items: center;

    img {
      margin-left: 0.5rem;
      height: 23px;
    }
  }

  .company-logo {
    margin-right: 5em;

    img {
      width: 100px;
    }
  }

  @include mobile {
    $margin: 1rem;
    ul {
      margin-left: $margin;
    }

    .company-logo {
      margin-right: $margin;
    }
  }
}
</style>
