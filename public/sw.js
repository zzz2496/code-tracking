const CACHE_NAME = 'ParadigmREVOLUTION-cache-v1';
const FILES_TO_CACHE = [
	//   '../node_modules/@surrealdb/wasm/dist/surreal/index_bg.wasm', // Add any other assets you want to cache
	'/surrealdb.wasm/index_bg.wasm',
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately after installation
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached resource or fetch from network
      return response || fetch(event.request);
    })
  );
});