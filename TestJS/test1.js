// document.addEventListener('DOMContentLoaded', () => {
// 	console.log('file test1.js');
// 	document.dispatchEvent(new Event('test1Loaded'));
// });
console.log('file test1.js');
eventBus.on('test1Loaded', () => {
	console.log('test1Loaded in file test1.js');
});
eventBus.dispatch('test1Loaded');
