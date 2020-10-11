<template>
  <div class="attendees" v-if="attendees.length > 0">
    <h2>Deltakere ({{ attendees.length }})</h2>
    <div class="attendees-container" ref="attendees">
      <div class="attendee" v-for="(attendee, index) in flipList(attendees)" :key="index">
        <span class="attendee-name">{{ attendee.name }}</span>
        <div class="red-raffle ballot-element small">{{ attendee.red }}</div>
        <div class="blue-raffle ballot-element small">{{ attendee.blue }}</div>
        <div class="green-raffle ballot-element small">{{ attendee.green }}</div>
        <div class="yellow-raffle ballot-element small">{{ attendee.yellow }}</div>
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
}

.attendees {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 65%;
  height: 100%;
}

.attendees-container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.attendee {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}
</style>
