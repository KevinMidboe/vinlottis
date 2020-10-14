var version = "v1.0" + __DATE__;
var cacheName = "vinlottis";
var CACHE_NAME = cacheName;
var CACHE_NAME_API = cacheName + "::api";
var STATIC_CACHE_URLS = ["/"];

console.log("Nåværende versjon:", version);
self.addEventListener("activate", event => {
  console.log("Aktiverer");

  event.waitUntil(self.clients.claim());
  event.waitUntil(removeCache(CACHE_NAME));
  event.waitUntil(removeCache(CACHE_NAME_API));
  event.waitUntil(addCache(CACHE_NAME, STATIC_CACHE_URLS));
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  if (
    event.notification.data != undefined &&
    event.notification.data.link != undefined
  ) {
    event.waitUntil(clients.openWindow(event.notification.data.link));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});

self.addEventListener("message", event => {
  if (!__PUBLICKEY__) {
    return;
  }
  if (event.data === "updatePush") {
    event.waitUntil(
      new Promise((resolve, reject) => {
        const applicationServerKey = urlB64ToUint8Array(__PUBLICKEY__);
        const options = { applicationServerKey, userVisibleOnly: true };
        self.registration.pushManager
          .subscribe(options)
          .then(subscription =>
            saveSubscription(subscription)
              .then(() => {
                try {
                  const channel = new BroadcastChannel("updatePush");
                  channel.postMessage({ success: true });
                } catch (e) {
                  console.log("Using safari 'eh? No notifications for you.");
                }
                resolve();
              })
              .catch(() => {
                resolve();
              })
          )
          .catch(() => {
            console.log("Kunne ikke legge til pushnotifications");
            reject();
          });
      })
    );
  }
});

self.addEventListener("push", function(event) {
  if (event.data) {
    var message = JSON.parse(event.data.text());
    var link = "/";
    if (message.link != undefined) {
      link = message.link;
    }

    showLocalNotification(
      message.title,
      message.message,
      link,
      self.registration
    );
  } else {
  }
});

self.addEventListener("install", event => {
  console.log("Arbeids arbeideren installerer seg.");
  self.skipWaiting();
  event.waitUntil(addCache(CACHE_NAME, STATIC_CACHE_URLS));
});

self.addEventListener("fetch", event => {
  if (
    event.request.url.includes("/login") ||
    event.request.url.includes("/update") ||
    event.request.url.includes("/register") ||
    event.request.method == "POST" ||
    event.request.url.includes("/api/wines/prelottery") ||
    event.request.url.includes("/api/virtual") ||
    event.request.url.includes("/socket.io")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  )
    return;

  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then(response => cache(event.request, response))
        .catch(function() {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches
        .match(event.request) // check if the request has already been cached
        .then(cached => cached || fetch(event.request)) // otherwise request network
        .then(
          response =>
            staticCache(event.request, response) // put response in cache
              .then(() => response) // resolve promise with the network response
        )
    );
  }
});

function showLocalNotification(title, body, link, swRegistration) {
  const options = {
    body,
    icon: "https://lottis.vin/assets/images/favicon.png",
    image: "https://lottis.vin/assets/images/favicon.png",
    vibrate: [300],
    data: { link: link }
  };
  swRegistration.showNotification(title, options);
}

async function saveSubscription(subscription) {
  const SERVER_URL = "/subscription/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
}

const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

function addCache(cacheKey, cacheUrls) {
  return caches.open(cacheKey).then(cache => {
    console.log("Legger til cache", cache);
    return cache.addAll(cacheUrls);
  });
}

function removeCache(cacheKey) {
  return caches
    .keys()
    .then(keys => keys.filter(key => key !== cacheKey))
    .then(keys =>
      Promise.all(
        keys.map(key => {
          console.log(`Sletter mellom-lager på nøkkel ${key}`);
          return caches.delete(key);
        })
      )
    );
}

function staticCache(request, response) {
  if (response.type === "error" || response.type === "opaque") {
    return Promise.resolve(); // do not put in cache network errors
  }

  return caches
    .open(CACHE_NAME)
    .then(cache => cache.put(request, response.clone()));
}

function cache(request, response) {
  if (response.type === "error" || response.type === "opaque") {
    return response;
  }

  return caches.open(CACHE_NAME_API).then(cache => {
    cache.put(request, response.clone());
    return response;
  });
}
