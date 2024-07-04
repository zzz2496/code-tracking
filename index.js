//check if service worker is supported
if ('serviceWorker' in navigator) {
	//register service worker
	navigator.serviceWorker.register('./sw.js')
		.then((register) => console.log('Service Worker Registered', register))
		.catch((error) => console.log('Service Worker Registration Failed', error));
} else {
	console.error('Service Worker not supported');
}