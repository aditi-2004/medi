const CACHE_NAME = "medi-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./images/icon-192x192.jpg",
  "./images/icon-512x512.jpg",
  "./images/medical-background.jpg",
  "./images/ortho.jpg",
  "./images/gyne.jpg",
  "./images/genral.jpg",
  "./images/calcimax.jpg",
  "./images/osteofos.jpg",
  "./images/dolo-650.jpg",
  "./images/flexaura-d.jpg",
  "./images/shelcal.jpg",
  "./images/femilon.jpg",
  "./images/ovral.jpg",
  "./images/gestofit.jpg",
  "./images/fol123.jpg",
  "./images/m2-tone.jpg",
  "./images/crosin.jpg",
  "./images/amoxicillin-500.jpg",
  "./images/pantoprazole-40.jpg",
  "./images/ors-sachet.jpg",
  "./images/cetirizine.jpg",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((res) => {
            if (
              !res ||
              res.status !== 200 ||
              res.type !== "basic"
            ) {
              return res;
            }
            let resToCache = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resToCache);
            });
            return res;
          })
          .catch(() => {
            if (event.request.destination === "image") {
              return caches.match("./images/icon-192x192.png");
            }
            return caches.match("./index.html");
          })
      );
    })
  );
});
