const CACHE_NAME = "pharmacare-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/medical-background.jpg",
  "/images/ortho.jpg",
  "/images/gyne.jpg",
  "/images/genral.jpg",
  "/images/calcimax.jpg",
  "/images/osteofos.jpg",
  "/images/dolo-650.jpg",
  "/images/flexaura-d.jpg",
  "/images/shelcal.jpg",
  "/images/femilon.jpg",
  "/images/ovral.jpg",
  "/images/gestofit.jpg",
  "/images/fol123.jpg",
  "/images/m2-tone.jpg",
  "/images/crosin.jpg",
  "/images/amoxicillin-500.jpg",
  "/images/pantoprazole-40.jpg",
  "/images/ors-sachet.jpg",
  "/images/cetirizine.jpg",
];

// Install event - Cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Cache-first strategy with offline fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Cache-first for static assets
  if (url.pathname.match(/\.(html|css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("Serving from cache:", event.request.url);
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            if (event.request.destination === "image") {
              return caches.match("/images/icon-192x192.png");
            }
            return caches.match("/index.html");
          });
      })
    );
  }
});
