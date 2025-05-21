// broker.js
const fs = require('fs');
const aedes = require('aedes')();
const net = require('net');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

// TLS certs for WSS
const tlsOptions = {
  key: fs.readFileSync('../certs/cert-key.pem'),
  cert: fs.readFileSync('../certs/cert.pem'),
};

// ==== USERS TABLE ====
const users = [
	{ username: 'admin', password: 'admin' },
	{ username: 'user1', password: 'password1' },
	{ username: 'user2', password: 'password2' }
];

// ==== AUTHENTICATION ====
aedes.authenticate = function (client, username, password, callback) {
  const pw = password ? password.toString() : '';

  const user = users.find(u => u.username === username && u.password === pw);

  if (user) {
    console.log(`🔐 Auth success: ${username}`);
    callback(null, true);
  } else {
    console.log(`⛔ Auth failed for user: ${username}`);
    const error = new Error('Authentication failed');
    error.returnCode = 4; // MQTT "Bad username or password"
    callback(error, false);
  }
};

// ==== 1. TCP (mqtt://localhost:1883) ====
const tcpServer = net.createServer(aedes.handle);
tcpServer.listen(1883, () => {
  console.log('📡 MQTT broker listening on mqtt://localhost:1883');
});

// ==== 2. HTTP + WebSocket (ws://localhost:8000) ====
const httpServer = http.createServer();
const wsServer = new WebSocket.Server({ server: httpServer });
wsServer.on('connection', (ws) => {
  const stream = WebSocket.createWebSocketStream(ws);
  aedes.handle(stream);
});
httpServer.listen(8000, () => {
  console.log('🌐 WebSocket server listening on ws://localhost:8000');
});

// ==== 3. HTTPS + Secure WebSocket (wss://localhost:8888) ====
const httpsServer = https.createServer(tlsOptions);
const wssServer = new WebSocket.Server({ server: httpsServer });
wssServer.on('connection', (ws) => {
  const stream = WebSocket.createWebSocketStream(ws);
  aedes.handle(stream);
});
httpsServer.listen(8888, () => {
  console.log('🔐 Secure WebSocket server listening on wss://localhost:8888');
});

// ==== Optional: Logging ====
aedes.on('client', client => {
  console.log(`👤 Client connected: ${client?.id || 'unknown'}`);
});

aedes.on('clientReady', (client) => {
  console.log(`✅ ${client.id} connected using MQTT v${client.version}`);
});

aedes.on('clientDisconnect', client => {
  console.log(`❌ Client disconnected: ${client?.id || 'unknown'}`);
});

aedes.on('publish', (packet, client) => {
  if (client) {
    console.log(`📨 ${client.id} -> ${packet.topic}: ${packet.payload.toString()}`);
  }
});
