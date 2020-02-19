<template>
  <div class="app-container">
    <banner />
    <router-view />
  </div>
</template>

<script>
import banner from "@/ui/Banner";
export default {
  name: "vinlottis",
  components: { banner },
  props: {},
  data() {
    return {};
  },
  mounted() {
    console.log("SNEAKY PETE!");
    if ("serviceWorker" in navigator) {
      const channel = new BroadcastChannel("updatePush");
      channel.addEventListener("message", event => {
        if (event.data.success) {
          localStorage.setItem("push", true);
        }
      });

      navigator.serviceWorker
        .register("/service-worker.js")
        .then(serviceWorker => {
          console.log(
            "Arbeids arbeideren din er installert. Du kan nå gå offline frem til neste trekning."
          );

          // From your client pages:

          serviceWorker.onupdatefound = () => {
            const installingWorker = serviceWorker.installing;
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Preferably, display a message asking the user to reload...
                location.reload();
              }
            };
          };

          if (!("PushManager" in window)) {
            throw new Error("No Push API Support!");
          }
          window.Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
              console.log(
                "Du valgte å ikke ha arbeids-arbeideren til å sende deg dytte-meldinger :'('"
              );
              return;
            }
            if (localStorage.getItem("push") == null) {
              this.sendMessage("updatePush");
            }
          });
        })
        .catch(error => {
          console.error("Arbeids arbeideren klarer ikke arbeide.", error);
        });
    }
  },
  computed: {},

  methods: {
    sendMessage: function(message) {
      // This wraps the message posting/response in a promise, which will
      // resolve if the response doesn't contain an error, and reject with
      // the error if it does. If you'd prefer, it's possible to call
      // controller.postMessage() and set up the onmessage handler
      // independently of a promise, but this is a convenient wrapper.
      return new Promise(function(resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };

        // This sends the message data as well as transferring
        // messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply
        // via postMessage(), which will in turn trigger the onmessage
        // handler on messageChannel.port1.
        // See
        // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        if (navigator.serviceWorker.controller == null) {
          resolve();
        }
        navigator.serviceWorker.controller.postMessage(message, [
          messageChannel.port2
        ]);
      });
    }
  }
};
</script>

<style lang="scss">
@import "./styles/global.scss";
@font-face {
  font-family: "knowit";
  font-weight: 600;
  src: url("/../public/assets/fonts/bold.woff"),
    url("/../public/assets/fonts/bold.woff") format("woff"), local("Arial");
  font-display: swap;
}

@font-face {
  font-family: "knowit";
  font-weight: 300;
  src: url("/../public/assets/fonts/regular.eot"),
    url("/../public/assets/fonts/regular.woff") format("woff"), local("Arial");
  font-display: swap;
}

body {
  background-color: #dbeede;
}
</style>

<style scoped>
.app-container {
  background-color: white;
  min-height: 100vh;
}
</style>
