console.log('Start Service Worker');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');
console.log('import workbox done');

workbox.routing.registerRoute(
	/\.(?:css|js)$/,
	new workbox.strategies.StaleWhileRevalidate({
		"cacheName": "assets",
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				"maxEntries": 200,
				"maxAgeSeconds": 60 * 60 * 24 * 365
			}),
		]
	})
);
workbox.routing.registerRoute(
	/\.(?:png|jpg|gif)$/,
	new workbox.strategies.CacheFirst({
		"cacheName": "images",
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				"maxEntries": 200,
				"maxAgeSeconds": 60 * 60 * 24 * 365
			}),
		]
	})
)

console.log('End Service Worker');