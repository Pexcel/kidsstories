const CACHE_NAME = "animated-bible-tv-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add("/bible/kjv.json");
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Keep the Bible available offline.
  if (url.pathname === "/bible/kjv.json") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });

            return response;
          })
        );
      })
    );

    return;
  }

  // Website pages should always try the newest version first.
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});