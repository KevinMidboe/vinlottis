var version = "v1.0" + __DATE__;
var cacheName = "vinlottis";
var CACHE_NAME = cacheName;
var CACHE_NAME_API = cacheName + "::api";
var STATIC_CACHE_URLS = ["/"];

console.log("Nåværende versjon:", version);
self.addEventListener("activate", event => {
  event.waitUntil(removeCache(CACHE_NAME));
  event.waitUntil(removeCache(CACHE_NAME_API));
  event.waitUntil(addCache(CACHE_NAME, STATIC_CACHE_URLS));
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
    event.request.method == "POST"
  ) {
    event.respondWith(fetch(event.request));
    return;
  }
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
