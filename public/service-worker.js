var version = "v1.0";
var cacheName = "::vinlottis";
var CACHE_NAME = version + cacheName;
var STATIC_CACHE_URLS = ["/"];

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.log(`Deleting cache ${key}`);
            return caches.delete(key);
          })
        )
      )
  );
});

self.addEventListener("install", event => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
  event.waitUntil(
    fetch(event.request)
      .then(function(response) {
        cache(event.request, response);
      })
      .catch(error => {})
  );
});

function cache(request, response) {
  if (response.type === "error" || response.type === "opaque") {
    return Promise.resolve(); // do not put in cache network errors
  }

  return caches
    .open(CACHE_NAME)
    .then(cache => cache.put(request, response.clone()));
}
