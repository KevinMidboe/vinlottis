<template>
  <div class="page-container">
    <h1>Send push melding</h1>

    <div class="notification-element">
      <div class="label-div">
        <label for="notification">Melding</label>
        <textarea id="notification" type="text" rows="3" v-model="pushMessage" placeholder="Push meldingtekst" />
      </div>
      <div class="label-div">
        <label for="notification-link">Push åpner lenke</label>
        <input id="notification-link" type="text" v-model="pushLink" placeholder="Push-click link" />
      </div>
    </div>
    <div class="button-container margin-top-sm">
      <button class="vin-button" @click="sendPush">Send push</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pushMessage: "",
      pushLink: "/"
    };
  },
  methods: {
    sendPush: async function() {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: this.pushMessage,
          link: this.pushLink
        })
      };

      return fetch("/subscription/send-notification", options)
        .then(resp => resp.json())
        .then(response => {
          if (response.success) {
            this.$toast.info({
              title: "Sendt!"
            });
          } else {
            this.$toast.error({
              title: "Noe gikk galt!",
              description: response.message
            });
          }
        });
    }
  }
};
</script>
