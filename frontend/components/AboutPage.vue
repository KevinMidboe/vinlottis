<template>
  <div>
    <div class="header-chin">
      <h1>Om oss</h1>
    </div>

    <div class="container">
      <div class="github">
        <h2>Project contributors</h2>

        <div class="contributors">
          <a class="contributor" v-for="contributor in contributors" :href="contributor.profileUrl">
            <img :src="contributor.avatarUrl" />
            <span class="name">{{ contributor.name }}</span>

            <span>Contributions: {{ contributor.projectContributions }}</span>
          </a>
        </div>
      </div>

      <div class="">
        <h2>Project guidelines</h2>
        <p>Lorem ipsum</p>
      </div>
    </div>
  </div>
</template>

<script>
import { projectContributors } from "@/api";

export default {
  data() {
    return {
      contributors: []
    }
  },
  mounted() {
    this.fetchContributors()
  },
  methods: {
    fetchContributors() {
      projectContributors()
        .then(contributors => contributors.contributors)
        .then(contributors => this.filterOutBots(contributors))
        .then(contributors => this.contributors = contributors);
    },
    filterOutBots(contributors) {
      return contributors.filter(contributor => !contributor.name.includes('[bot]'))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

.header-chin {
  padding: 3rem 0 4rem;
  margin-bottom: 4rem;
  background-color: $primary;

  h1 {
    font-family: 'knowit';
    font-weight: 400;
    font-size: 3.5rem;
    display: block;
    width: max-content;
    margin: 0 auto;
  }
}

.container {
  margin: 0 10vw 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @include mobile {
    margin: 0 5vw 1rem;
    grid-template-columns: 1fr;
  }
}

.github {
  padding-right: 1.5rem;
}

.contributors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @include mobile {
    grid-template-columns: repeat(3, 1fr);
  }
  // grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.contributor {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  margin-right: 1rem;
  // min-width: 125px;
  color: $matte-text-color;

  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);

  img {
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  span {
    margin: 0.5rem;

    &:first-of-type {
      margin-bottom: 0;
    }
  }

  .name {
    font-weight: 600;
    width: max-content;
    border-bottom: 2px solid transparent;

    &:hover {
      border-color: $link-color;
    }
  }
}
</style>