const CACHE_NAME = "oryouri-mazemaze-v20260503-2";

const PRECACHE_PATHS = [
  "./",
  "index.html",
  "app.js",
  "styles.css",
  "favicon.ico",
  "manifest.webmanifest",
  "sw.js",
  "assets/images/dishes/pancake.svg",
  "assets/images/dishes/curry.svg",
  "assets/images/dishes/juice.svg",
  "assets/images/dishes/pudding.svg",
  "assets/images/dishes/jelly.svg",
  "assets/images/dishes/icecream.svg",
  "assets/icons/icon.svg",
  "assets/icons/icon-180.svg",
  "assets/icons/icon-192.svg",
  "assets/icons/icon-512.svg",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-180.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png"
];

function scopeUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_PATHS.map(scopeUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(scopeUrl("./"), copy));
          return response;
        })
        .catch(() => caches.match(scopeUrl("./")).then((cached) => cached || caches.match(scopeUrl("index.html"))))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
