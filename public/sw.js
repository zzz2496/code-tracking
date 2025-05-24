const CACHE_NAME = 'ParadigmREVOLUTION-cache-v1.3';
const FILES_TO_CACHE = [
  	'/',
	'/index.html',
	'/index.css',
	'/paradigm_modules/icons/32.png',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/all.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/brands.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/fontawesome.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/solid.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/regular.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/svg-with-js.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/v4-font-face.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/css/v5-font-face.min.css',
	'/paradigm_modules/fontawesome-free-6.7.1-web/webfonts/fa-solid-900.woff2',
	'/paradigm_modules/Rochester/Rochester-Regular.ttf',
	'/paradigm_modules/Bebas_Neue/BebasNeue-Regular.ttf',
	'/ParadigmScripts/sw_loader.js',
	'/ParadigmScripts/UI.js',
	'/ParadigmScripts/startup.js',
	'/ParadigmScripts/module_loader.js',
	'/ParadigmScripts/surrealdb_loader.js',
	'/ParadigmScripts/graph_loader.js',
	'/ParadigmScripts/paradigm_revolution.js',
	'/Classes/Utility.mjs',
	'/Classes/Flow.mjs',
	'/Classes/SurrealDBinterface.mjs',
	'/node_modules/@surrealdb/wasm/dist/surreal/index.bundled.js',
	'/node_modules/@surrealdb/wasm/dist/surreal/index_bg.wasm',
	'/node_modules/surrealdb/dist/index.bundled.mjs',
	'/node_modules/surrealdb/dist/index.bundled.mjs.map',
	'/node_modules/mqtt/dist/mqtt.esm.js',
	'/node_modules/ulid/dist/index.esm.js',
	'/node_modules/finderjs/build/finder.min.js',	
	'/node_modules/bulma/css/bulma.min.css',
];

// Install event: pre-cache everything
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache first
self.addEventListener('fetch', event => {
  // Handle SPA routing and navigation requests
  if (event.request.mode === 'navigate') {
    console.log('[ServiceWorker] Intercepting navigation to:', event.request.url);
    event.respondWith(
      caches.match('/index.html').then(response => {
        if (response) {
          console.log('[ServiceWorker] Serving index.html from cache');
          return response;
        }
        console.log('[ServiceWorker] index.html not in cache, fetching from network');
        return fetch(event.request);
      })
    );
    return;
  }

  // Static file requests
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(
          '%c[ServiceWorker] Cache hit: ' + event.request.url,
          'color: green; font-weight: bold'
        );
        return response;
      }
      console.log(
        '%c[ServiceWorker] Cache miss: ' + event.request.url,
        'color: red; font-weight: bold'
      );
      return fetch(event.request);
    })
  );
});