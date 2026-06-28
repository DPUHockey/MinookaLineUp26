/* Minooka Hockey — Service Worker
   Version stamp is injected by the app at install time.
   Each time a new sw.js is deployed, the browser detects the change,
   installs the new worker, and the app shows an "Update available" banner.
*/

const CACHE_NAME = 'minooka-v1';

/* On install: cache the app shell */
self.addEventListener('install', event => {
  // Do NOT skip waiting automatically — let the banner prompt the user
});

/* On activate: claim all clients right away */
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

/* Listen for SKIP_WAITING message from the page (sent when user taps UPDATE NOW) */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* Fetch strategy: network-first for the main page, cache fallback */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache a fresh copy
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
