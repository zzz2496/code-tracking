// publish.js
const mqtt = require('mqtt');

const client = mqtt.connect('ws://localhost:8888');

client.on('connect', () => {
	console.log('✅ Connected to broker over WebSocket');

	const topic = 'test/topic';
	const message = 'Hello from WebSocket publisher';

	client.publish(topic, message, () => {
		console.log(`📤 Published to "${topic}":`, message);
		client.end();
	});
});
