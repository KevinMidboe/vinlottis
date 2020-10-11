<template>
  <Wine :wine="wine">
    <template v-slot:top>
      <div class="flex justify-end">
        <div class="requested-count cursor-pointer" @click="request">
          <span>{{ requestedElement.count }}</span>
          <i class="icon icon--heart">{{ locallyRequested ? "💜" : "🤍" }}</i>
        </div>
      </div>
    </template>

    <template v-slot:default>
      <button @click="deleteWine(wine)" v-if="showDeleteButton == true" class="vin-button small danger">
        Slett vinen
      </button>
    </template>

    <template v-slot:bottom>
      <a aria-role="button" tabindex="0" class="link float-left" @click="request"
         :class="{ 'active': locallyRequested }">
        Anbefal
      </a>

      <a aria-role="button" tabindex="0" class="link float-left" @click="request"
         :class="{ 'active': locallyRequested }">
      </a>
    </template>
  </Wine>
</template>

<script>
import { deleteRequestedWine, requestNewWine } from "@/api";
import Wine from "@/ui/Wine";

export default {
  components: {
    Wine
  },
  data(){
    return {
      wine: this.requestedElement.wine,
      locallyRequested: false
    }
  },
  props: {
    requestedElement: {
      required: true,
      type: Object
    },
    showDeleteButton: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    request(wine){
      this.locallyRequested = true
      this.requestedElement.count = this.requestedElement.count +1
      requestNewWine(wine)
    },
    async deleteWine(wine) {
      if (window.confirm("Er du sikker på at du vil slette vinen?")) {
        let response = await deleteRequestedWine(wine);
        if (response['success'] == true) {
          this.$emit('wineDeleted', wine);
        } else {
          alert("Klarte ikke slette vinen");
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.requested-count {
  display: inline-block;
  margin-top: -0.5rem;
  background-color: rgb(244,244,244);
  border-radius: 1.1rem;
  font-size: 1.1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  
  span {
    padding: 0.6rem 0;
    padding-right: 0.25rem;
    display: inline-block;
  }

  .icon {
    font-style: unset;
  }
}
</style>