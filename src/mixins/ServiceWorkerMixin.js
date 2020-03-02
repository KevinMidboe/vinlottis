var serviceWorkerRegistrationMixin = {
  created: function() {
    if (!("serviceWorker" in navigator)) {
      console.log("Nettleseren din støtter ikke service-workers.");
      return;
    }
    if ("PushManager" in window && __PUSHENABLED__) {
      if (Notification.permission !== "granted") {
        localStorage.removeItem("push");
      }
    }
    this.registerPushListener();
    this.registerServiceWorker();
  },
  methods: {
    registerPushListener: function() {
      try {
        const channel = new BroadcastChannel("updatePush");
        channel.addEventListener("message", event => {
          if (event.data.success) {
            localStorage.setItem("push", true);
            this.$emit("push-allowed");
          }
        });
      } catch (e) {
        console.log("Using safari 'eh? No notifications for you.");
      }
    },
    sendMessage: function(message) {
      return new Promise(function(resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };
        if (navigator.serviceWorker.controller == null) {
          resolve();
        } else {
          navigator.serviceWorker.controller.postMessage(message, [
            messageChannel.port2
          ]);
        }
      });
    },
    serviceWorkerUpdateFoundListener: function(serviceWorker) {
      const installingWorker = serviceWorker.installing;
      installingWorker.onstatechange = () => {
        if (
          installingWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          this.$emit("service-worker-updated");
        }
      };
    },
    registerServiceWorkerPushNotification: function() {
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
    },
    registerServiceWorker: function() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(serviceWorker => {
            console.log(
              "Arbeids arbeideren din er installert. Du kan nå gå offline frem til neste trekning."
            );
            serviceWorker.onupdatefound = () => {
              this.serviceWorkerUpdateFoundListener(serviceWorker);
            };
          })
          .catch(error => {
            console.error("Arbeids arbeideren klarer ikke arbeide.", error);
          });
      }
    }
  }
};

module.exports = serviceWorkerRegistrationMixin;
