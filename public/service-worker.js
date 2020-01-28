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
  console.log("Arbeids arbeideren installerer seg.");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => cache(event.request, response))
      .catch(function() {
        return caches.match(event.request);
      })
  );
});

function cache(request, response) {
  //console.log(response.type === "error" || response.type === "opaque", request);
  if (response.type === "error" || response.type === "opaque") {
    return response;
  }

  return caches.open(CACHE_NAME).then(cache => {
    cache.put(request, response.clone());
    return response;
  });
}
