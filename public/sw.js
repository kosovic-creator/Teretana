const CACHE_NAME = "hulk23-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("hulk23-offline-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      )),
      self.clients.claim(),
    ]),
  );
});

// Only full-page GET navigations use the offline screen. Authenticated pages,
// API requests, RSC responses and Server Actions are never cached by this worker.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const offline = await caches.match(OFFLINE_URL);
      return offline || new Response("Nema veze sa serverom. Pokušaj ponovo.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }),
  );
});
