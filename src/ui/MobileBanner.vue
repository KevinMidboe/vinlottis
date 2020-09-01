<template>
  <main>
    <div class="top-banner">
      <span class="burger-menu" @click="toggleShowMenu">
        <svg viewBox="0 0 100 80" width="40" height="40">
          <rect width="100" height="14"></rect>
          <rect y="30" width="100" height="14"></rect>
          <rect y="60" width="100" height="14"></rect>
        </svg>
      </span>
      <router-link to="/" class="link">
        <img src="/public/assets/images/knowit.svg" alt="knowit logo" />
      </router-link>
    </div>
    <section v-if="toggleMenu" class="route-container">
        <div v-for="(route, index) in routes" :key="index" class="__routes">
          <router-link :to="route.route" class="_specific">
            {{route.name}}
          </router-link>
        </div>
      </section>
  </main>
</template>

<script>
export default {
  data(){
    return {
      toggleMenu: false,
      routes: [
        {
          name: "Dagens viner",
          route: "/dagens/"
        },
        {
          name: "History",
          route: "/history/"
        },
        {
          name: "Lotteriet",
          route: "/lottery/game/"
        },
        // {
        //   name: "Foreslå vin",
        //   route: "/request"
        // },
        // {
        //   name: "Foreslåtte viner",
        //   route: "/all-requested-wines"
        // },
      ]
    }
  },
  methods:{
    toggleShowMenu(){
      this.toggleMenu = this.toggleMenu ? false : true
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../styles/variables.scss";

.link {
  text-decoration: none;
  color: #333333;
}

.top-banner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  background-color: $primary;
  -webkit-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  -moz-box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  box-shadow: 0px 0px 22px -8px rgba(0, 0, 0, 0.65);
  padding: 0px 10px;
  
  img {
      height: 23px;
  }
  
  .__routes{
    text-decoration: none;
    color: #333333;
  }
}

.route-container{
  background-color: $primary;
  display: flex;
  flex-direction: column;
  

  .__routes{
    margin: 10px;
    ._specific {
      text-decoration: none;
      color: #333333;
    }
  }
}

</style>
