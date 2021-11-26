<template>
  <div class="flex column">
    <div @click="toggleMessage" :class="{error: log.type === 'error', open: messageOpen}" class="flex log" :data-details="`${log.type} @ ${log.timestamp}`">
        <Chevron class="chevron" :rotate="messageOpen" />
        <span>{{ log.message }}</span>

    </div>
    <transition name="slide">
      <div v-if="messageOpen" class="details">{{ otherData(log) }}</div>
    </transition>
  </div>
</template>

<script>
import Chevron from "@/ui/Chevron";

export default {
  components: { Chevron },
  props: {
    log: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      messageOpen: null
    }
  },
  methods: {
    toggleMessage(index) {
      this.messageOpen = !this.messageOpen;
      this.$emit('toggleMessage', this.messageOpen)
      setTimeout(() => {
        document.getElementsByClassName('selected')[0].classList.add('error')
      }, 1000)
    },
    otherData(data) {
      const ldata = { ...data };
      delete ldata.type;
      delete ldata.message
      if (Object.keys(ldata).length > 0) {
        return Object.keys(data).map(key => {
          if (typeof data[key] === 'object') {
            return `${key}: ${JSON.stringify(data[key], null, 1)}`
          }
          return `${key}: ${data[key]}`}
        ).join('\n')
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  display: inline-flex;
  background-color: inherit;
  color: inherit;
  margin: 0.2rem 0.2rem 0;
  padding: 0 1rem 0.5rem;
  border-bottom: 1px solid #333333;
}

.chevron {
  padding-right: 0.5rem;
}

.slide-enter-active {
   -moz-transition-duration: 0.2s;
   -webkit-transition-duration: 0.2s;
   -o-transition-duration: 0.2s;
   transition-duration: 0.2s;
   -moz-transition-timing-function: ease;
   -webkit-transition-timing-function: ease;
   -o-transition-timing-function: ease;
   transition-timing-function: ease;
}

.slide-leave-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: ease;
   -webkit-transition-timing-function: ease;
   -o-transition-timing-function: ease;
   transition-timing-function: ease;
}

.slide-enter-to, .slide-leave {
   max-height: 100px;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.log {
  padding: 0 0.5rem;
  position: relative;
  // width: 100%;
  cursor: pointer;

  &.error {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    background-color: #F24647;
    color: white;
  }
  &.error.open {
    border-top-right-radius: 0px;
  }

  &:hover {
    background-color: rgba(128, 127, 127, 0.8);

    &.error {
      background-color: #F24647;
      border-top-left-radius: 0px;
    }

    &.error:after {
      background-color: rgba(#F24647, .8);
      border-radius: 0;
    }

    &:after {
      pointer-events: none;
      content: attr(data-details);
      display: block;
      color: white;
      position: absolute;
      top: -22px;
      line-height: 22px;
      left: 0;
      background-color: inherit;
      padding: 0 .5rem;
      border-top-right-radius: 6px;
    }
  }
}
</style>
