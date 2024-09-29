class EventBus_v1 {
	constructor() {
		this.listeners = {};
	}

	on(eventName, callback) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(callback);
	}

	dispatch(eventName) {
		if (this.listeners[eventName]) {
			this.listeners[eventName].forEach(callback => callback());
		}
	}

	hasDispatched(eventName) {
		return this.listeners[eventName] && this.listeners[eventName].length > 0;
	}
}
window.eventBus = new EventBus();
