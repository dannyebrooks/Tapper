/* ═══════════════════════════════════════════════════════════════
   TapFlow — Service Worker
   Caches core assets for offline play and fast loading
   ═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'tapflow-v1';

// Files to cache on install
const PRECACHE_URLS = [
  '/game/index.html',
  '/game/manifest.json',
  '/assets/tapflow-logo.png',
  '/assets/background-game.png',
];

// ─── Install: populate cache ────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // Activate immediately — don't wait for page reload
      return self.skipWaiting();
    })
  );
});

// ─── Activate: clean old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// ─── Fetch: serve from cache, fall back to network ──────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-ok responses or non-image/document types
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response — one to return, one to cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache same-origin requests
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // Network failed — try to return a fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/game/index.html');
        }
        // For other requests, just fail
        return new Response('Offline', { status: 503 });
      });
    })
  );
});