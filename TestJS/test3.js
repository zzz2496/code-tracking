console.log('file test3.js');
if (eventBus.hasDispatched('test1Loaded')) {
	console.log('test1 has finished loading, reading from file test3.js');
	// do some work
	eventBus.dispatch('test2Loaded');
}