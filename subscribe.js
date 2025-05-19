// subscribe.js
const mqtt = require('mqtt');

const client = mqtt.connect('ws://localhost:8888');

client.on('connect', () => {
	console.log('✅ Connected to broker over WebSocket');

	const topic = 'test/topic';

	client.subscribe(topic, () => {
		console.log(`📡 Subscribed to "${topic}"`);
	});
});

client.on('message', (topic, message) => {
	console.log(`📬 Message on "${topic}":`, message.toString());
});
