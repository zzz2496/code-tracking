import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import serveIndex from 'serve-index';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import Surreal from 'surrealdb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionStore = new Map();
const app = express();
const PORT = process.env.PORT || 443;

// Load SSL
const certPath = path.join(__dirname, '../../certs');
const options = {
	key: fs.readFileSync(path.join(certPath, 'cert-key.pem')),
	cert: fs.readFileSync(path.join(certPath, 'cert.pem')),
};

// Middleware to attach UUID
app.use((req, res, next) => {
	let uuid = req.headers['x-client-uuid'] || req.query.uuid;

	if (!uuid) {
		uuid = uuidv4();
		res.setHeader('X-Generated-UUID', uuid);
	}

	req.clientUUID = uuid;
	next();
});

// ✅ Place API routes BEFORE static file serving
function generateDbToken() {
	return Math.random().toString(36).substring(2);
}

app.get('/api/session', (req, res) => {
	console.log('Request from:', req.hostname, req.ip);
	console.log('Headers:', req.headers);

	const uuid = req.clientUUID;

	if (!sessionStore.has(uuid)) {
		sessionStore.set(uuid, {
			createdAt: new Date(),
			dbToken: generateDbToken(),
		});
	}

	const session = sessionStore.get(uuid);

	res.type('application/json').json({
		uuid,
		session,
	});
});

// ✅ Now serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '../public/'), {
	extensions: ['html'],
	index: 'index.html'
}));

// Other directories (ParadigmScripts, etc.)
app.use('/ParadigmScripts', express.static(path.join(__dirname, '../ParadigmScripts')), serveIndex(path.join(__dirname, '../ParadigmScripts'), { icons: true }));
app.use('/paradigm_modules', express.static(path.join(__dirname, '../paradigm_modules')), serveIndex(path.join(__dirname, '../paradigm_modules'), { icons: true }));
app.use('/SystemBlueprint', express.static(path.join(__dirname, '../SystemBlueprint')), serveIndex(path.join(__dirname, '../SystemBlueprint'), { icons: true }));
app.use('/Classes', express.static(path.join(__dirname, '../Classes')), serveIndex(path.join(__dirname, '../Classes'), { icons: true }));

// node_modules (read-only GET/HEAD)
app.use('/node_modules',
	(req, res, next) => {
		console.log(`[NODE_MODULES] ${req.method} ${req.url}`);
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return res.status(405).send('Method Not Allowed');
		}
		next();
	},
	express.static(path.join(__dirname, '../node_modules'), {
		dotfiles: 'ignore',
		extensions: ['js', 'json', 'wasm', 'html', 'css', 'map', 'scss'],
		index: false,
	}),
	serveIndex(path.join(__dirname, '../node_modules'), { icons: true })
);

// Forbid sensitive files
app.use((req, res, next) => {
	const forbidden = ['server.js', 'package.json', 'package-lock.json'];
	if (forbidden.includes(req.url.slice(1))) {
		return res.status(403).send('Access Denied');
	}
	next();
});

// Catch-all 404
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

// HTTP to HTTPS redirect
http.createServer((req, res) => {
	res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
	res.end();
}).listen(80, () => {
	console.log('🌐 HTTP server redirecting to HTTPS on port 80');
});

// HTTPS server
https.createServer(options, app).listen(PORT, () => {
	console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});