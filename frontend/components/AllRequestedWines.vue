<template>
  <main class="container">
    <div class="header">
      <h1>Alle foreslåtte viner</h1>
      <router-link class="vin-button" to="/anbefal">
        Anbefal ny vin
        <i class="icon icon--arrow-right"></i>
      </router-link>
    </div>

    <section class="wines-container">
      <p v-if="wines == undefined || wines.length == 0">
        Ingen har foreslått noe enda!
      </p>

      <RequestedWineCard
        v-for="requestedWine in wines"
        :key="requestedWine.wine._id"
        :requestedElement="requestedWine"
        @wineDeleted="filterOutDeletedWine"
        :showDeleteButton="isAdmin"
      />
    </section>
  </main>
</template>

<script>
import RequestedWineCard from "@/ui/RequestedWineCard";
export default {
  components: {
    RequestedWineCard,
  },
  data() {
    return {
      wines: undefined,
      isAdmin: false,
    };
  },
  mounted() {
    this.fetchRequestedWines();
  },
  methods: {
    filterOutDeletedWine(wine) {
      this.wines = this.wines.filter((item) => item.wine._id !== wine._id);
    },
    fetchRequestedWines() {
      return fetch("/api/requests")
        .then((resp) => {
          this.isAdmin = resp.headers.get("vinlottis-admin") == "true";
          return resp;
        })
        .then((resp) => resp.json())
        .then((response) => (this.wines = response.wines));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/media-queries.scss";
@import "@/styles/variables.scss";

.container {
  width: 90vw;
  margin: 3rem auto;
  margin-bottom: 0;
  padding-bottom: 3rem;
}

h1 {
  font-size: 3rem;
  font-family: "knowit";
  color: $matte-text-color;
  font-weight: normal;
}

.header {
  display: flex;
  justify-content: space-between;

  @include mobile {
    flex-direction: column;

    a {
      align-self: flex-end;
      margin-bottom: 4rem;
    }
  }
}

a.vin-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(4rem - 20px);
}

a .icon {
  margin-left: 1rem;
  vertical-align: middle;
}
</style>
