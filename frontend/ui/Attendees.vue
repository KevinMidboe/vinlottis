<template>
  <div class="attendees" v-if="attendees.length > 0">
    <div class="attendees-container" ref="attendees">
      <div class="attendee" v-for="(attendee, index) in flipList(attendees)" :key="index">
        <span class="attendee-name">{{ attendee.name }}</span>
        <div class="red-raffle raffle-element small">{{ attendee.red }}</div>
        <div class="blue-raffle raffle-element small">{{ attendee.blue }}</div>
        <div class="green-raffle raffle-element small">{{ attendee.green }}</div>
        <div class="yellow-raffle raffle-element small">{{ attendee.yellow }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    attendees: {
      type: Array
    }
  },
  methods: {
    flipList: (list) => list.slice().reverse()
  },
  watch: {
    attendees: {
      deep: true,
      handler() {
        if (this.$refs && this.$refs.history) {
          setTimeout(() => {
            this.$refs.attendees.scrollTop = this.$refs.attendees.scrollHeight;
          }, 50);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/global.scss";
@import "../styles/variables.scss";
@import "../styles/media-queries.scss";

.attendee-name {
  width: 60%;
}

hr {
  border: 2px solid black;
  width: 100%;
}

.raffle-element {
  font-size: 0.75rem;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.75rem;
  text-align: center;

  &:not(:last-of-type) {
    margin-right: 1rem;
  }
}

.attendees {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
}

.attendees-container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  max-height: 550px;
}

.attendee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;

  &:not(:last-of-type) {
    border-bottom: 2px solid #d7d8d7;
  }
}
</style>
