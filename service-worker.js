// Service Worker for Latino Leaders 2026
// Provides offline support and faster loading

const CACHE_NAME = 'latino-leaders-2026-v2';

// Files to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/favicon.svg',
  '/404.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls - network first, return proper error response if offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // Try to return cached API data
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return a proper JSON error response for offline state
              return new Response(
                JSON.stringify({
                  error: 'offline',
                  message: 'You appear to be offline. Please check your connection and try again.'
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // For static assets and pages: cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version, but also update cache in background
          event.waitUntil(
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, networkResponse));
                }
              })
              .catch(() => {})
          );
          return cachedResponse;
        }

        // Not in cache - fetch from network and cache it
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok && url.origin === self.location.origin) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline and not in cache - show 404 for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/404.html');
            }
          });
      })
  );
});
