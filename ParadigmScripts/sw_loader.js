//check if service worker is supported
if ('serviceWorker' in navigator) {
	//register service worker
	console.log('Check if Service Worker is supported');
	if ('serviceWorker' in navigator) {
		console.log('Service Worker is supported!');
		window.addEventListener('load', () => {
			console.log('Window fully loaded');
			navigator.serviceWorker.register('/sw.js')
				.then((register) => console.log('Service Worker Registered', register))
				.catch((error) => console.log('Service Worker Registration Failed', error));
		});
	}

	// Unregister the service worker
	function unregisterSW() {
		console.log('Unregistering Service Worker');
		if ('serviceWorker' in navigator) {
			console.log('Service Worker is supported, attempting to unregister');
			navigator.serviceWorker.getRegistrations().then(registrations => {
				for (let reg of registrations) {
					reg.unregister().then(() => {
						console.log('Service Worker unregistered');
						alert('Service Worker disabled. Reload the page to see changes.');
					});
				}
			});
		}
	}

	// Clear all caches
	function clearCache() {
		console.log('Clearing all caches');
		if ('caches' in window) {
			console.log('Caches are supported, clearing all caches');
			// Clear all caches
			caches.keys().then(names => {
				Promise.all(names.map(name => caches.delete(name))).then(() => {
					console.log('All caches cleared');
					alert('Cache cleared. Reloading assets from the server.');
					location.reload(); // Reload to trigger network fetch
				});
			});
		}
	}
} else {
	console.error('Service Worker not supported');
}
