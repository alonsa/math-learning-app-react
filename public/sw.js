// Disney/Astro Bot Math Learning App - Service Worker
// Enables offline functionality and app installation

const CACHE_NAME = 'math-adventure-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/sounds/aluf.wav',
  '/sounds/Hitlahta.wav',
  '/sounds/you_made_it.wav',
  '/sounds/no.wav',
  '/sounds/close.wav',
  '/sounds/try_again.wav',
  '/sounds/button-click.wav',
  '/sounds/celebration.wav',
  // Add all letter sounds
  '/sounds/end_letters/A.wav',
  '/sounds/end_letters/B.wav',
  '/sounds/end_letters/C.wav',
  '/sounds/end_letters/D.wav',
  '/sounds/end_letters/E.wav',
  '/sounds/end_letters/F.wav',
  '/sounds/end_letters/G.wav',
  '/sounds/end_letters/H.wav',
  '/sounds/end_letters/I.wav',
  '/sounds/end_letters/J.wav',
  '/sounds/end_letters/K.wav',
  '/sounds/end_letters/L.wav',
  '/sounds/end_letters/M.wav',
  '/sounds/end_letters/N.wav',
  '/sounds/end_letters/O.wav',
  '/sounds/end_letters/P.wav',
  '/sounds/end_letters/R.wav',
  '/sounds/end_letters/S.wav',
  '/sounds/end_letters/T.wav',
  '/sounds/end_letters/U.wav',
  '/sounds/end_letters/V.wav',
  '/sounds/end_letters/X.wav',
  '/sounds/end_letters/Y.wav',
  '/sounds/end_letters/Z.wav'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🎮 Math Adventure SW: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('✅ Math Adventure SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.log('❌ Cache failed:', error);
        // Continue installation even if some files fail to cache
      })
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Math Adventure SW: Activated');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Math Adventure SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }

        // Not in cache, fetch from network and cache it
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch((error) => {
            console.log('❌ Fetch failed:', error);

            // Provide fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for when app comes back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Math Adventure SW: Background sync');
    // Could sync game progress or statistics here
  }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'math-adventure',
      renotify: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});