console.log('test2.js');
if (eventBus.hasDispatched('test1Loaded')) {
	console.log('test1 has finished loading, reading from file test2.js');
	// do some work
	eventBus.dispatch('test2Loaded');
}