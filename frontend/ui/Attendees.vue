<template>
  <div v-if="attendees.length > 0" class="attendee-container">
    <div class="attendee" v-for="(attendee, index) in flipList(attendees)" :key="index">
      <div class="attendee-info">
        <router-link class="attendee-name" :to="`/highscore/${attendee.name}`">
          {{ attendee.name }}
        </router-link>

        <div v-if="admin" class="flex column justify-center margin-top-sm">
          <span>Phone: {{ attendee.phoneNumber }}</span>
          <span>Has won: {{ attendee.winner }}</span>
        </div>

        <div class="raffle-container">
          <div class="red-raffle raffle-element small">{{ attendee.red }}</div>
          <div class="blue-raffle raffle-element small">{{ attendee.blue }}</div>
          <div class="green-raffle raffle-element small">{{ attendee.green }}</div>
          <div class="yellow-raffle raffle-element small">{{ attendee.yellow }}</div>
        </div>
      </div>

      <div v-if="admin" class="attendee-admin">
        <button class="vin-button edit small" @click="editingAttendee = editingAttendee == attendee ? false : attendee">
          {{ editingAttendee == attendee ? "Lukk" : "Rediger" }}
        </button>

        <button class="vin-button small danger" @click="deleteAttendee(attendee)">
          Slett deltaker
        </button>
      </div>

      <div v-if="editingAttendee == attendee" class="attendee-edit">
        <div class="label-div" v-for="key in Object.keys(attendee)" :key="key">
          <label>{{ key }}</label>
          <input type="text" v-model="attendee[key]" :placeholder="key" />
        </div>

        <div v-if="editingAttendee == attendee">
          <button class="vin-button small warning" @click="updateAttendee(attendee)">
            Oppdater deltaker
          </button>

          <button class="vin-button small danger" @click="deleteAttendee(attendee)">
            Slett deltaker
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    attendees: {
      type: Array
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editingAttendee: undefined
    };
  },
  methods: {
    flipList: list => list.slice().reverse(),
    updateAttendee(updatedAttendee) {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendee: updatedAttendee })
      };

      fetch(`/api/lottery/attendee/${updatedAttendee._id}`, options)
        .then(resp => resp.json())
        .then(response => {
          this.editingAttendee = null;

          const { message, success } = response;

          if (success) {
            this.$toast.info({
              title: response.message
            });
          } else {
            this.$toast.error({
              title: response.message
            });
          }
        });
    },
    deleteAttendee(deletedAttendee) {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendee: deletedAttendee })
      };

      fetch(`/api/lottery/attendee/${deletedAttendee._id}`, options)
        .then(resp => resp.json())
        .then(response => {
          this.editingAttendee = null;

          const { message, success } = response;

          if (success) {
            this.$toast.info({
              title: response.message
            });
          } else {
            this.$toast.error({
              title: response.message
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "@/styles/media-queries.scss";

.attendee-name {
  font-size: 1.1rem;
}

hr {
  border: 2px solid black;
  width: 100%;
}

.attendee-container {
  align-items: center;
  height: 100%;

  padding: 1rem;

  -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.15);
}

.attendee {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @include mobile {
    align-items: center;
    justify-content: center;
  }

  &:not(:last-of-type) {
    border-bottom: 2px solid #d7d8d7;
  }

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }

  button {
    margin-bottom: 0.5rem;
  }

  &-info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    @include mobile {
      flex-direction: column;
    }
  }

  &-edit {
    button {
      margin-top: 0.5rem;
    }
  }

  .raffle-container {
    display: flex;
    flex-direction: row;
  }
}
</style>
