var version = "v1.0" + __DATE__;
var cacheName = "vinlottis";
var CACHE_NAME = cacheName;
var CACHE_NAME_API = cacheName + "::api";
var STATIC_CACHE_URLS = ["/"];

console.log("Nåværende versjon:", version);
self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.log(`Sletter mellom-lager på nøkkel ${key}`);
            return caches.delete(key);
          })
        )
      )
  );
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME_API))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.log(`Sletter mellom-lager på nøkkel ${key}`);
            return caches.delete(key);
          })
        )
      )
  );

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Legger til cache", cache);
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
});

self.addEventListener("install", event => {
  console.log("Arbeids arbeideren installerer seg.");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Legger til cache", cache);
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
});

self.addEventListener("fetch", event => {
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

function staticCache(request, response) {
  if (response.type === "error" || response.type === "opaque") {
    return Promise.resolve(); // do not put in cache network errors
  }

  return caches
    .open(CACHE_NAME)
    .then(cache => cache.put(request, response.clone()));
}

function cache(request, response) {
  //console.log(response.type === "error" || response.type === "opaque", request);
  if (response.type === "error" || response.type === "opaque") {
    return response;
  }

  return caches.open(CACHE_NAME_API).then(cache => {
    cache.put(request, response.clone());
    return response;
  });
}
