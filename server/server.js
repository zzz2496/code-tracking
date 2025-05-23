const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const serveIndex = require('serve-index');

const app = express();
const PORT = process.env.PORT || 443;

// Load SSL certificates (assuming certs are in ../../certs)
const certPath = path.join(__dirname, '../../certs');
const options = {
	key: fs.readFileSync(path.join(certPath, 'cert-key.pem')),
	cert: fs.readFileSync(path.join(certPath, 'cert.pem')),
};

// Serve static files from one level up (app root)
app.use(express.static(path.join(__dirname, '../public/'), {
	extensions: ['html'],
	index: 'index.html'
}));

app.use(
	'/ParadigmScripts'
	, express.static(path.join(__dirname, '../ParadigmScripts'))
	, serveIndex(path.join(__dirname, '../ParadigmScripts'), { icons: true })
);
app.use(
	'/paradigm_modules'
	, express.static(path.join(__dirname, '../paradigm_modules'))
	, serveIndex(path.join(__dirname, '../paradigm_modules'), { icons: true })
);
app.use(
	'/SystemBlueprint'
	, express.static(path.join(__dirname, '../SystemBlueprint'))
	, serveIndex(path.join(__dirname, '../SystemBlueprint'), { icons: true })
);
app.use(
	'/Classes'
	, express.static(path.join(__dirname, '../Classes'))
	, serveIndex(path.join(__dirname, '../Classes'), { icons: true })
);

app.use(
	'/node_modules',
	(req, res, next) => {
		console.log(`[NODE_MODULES] ${req.method} ${req.url}`);
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return res.status(405).send('Method Not Allowed');
		}
		next();
	}
	, express.static(path.join(__dirname, '../node_modules'), {
		dotfiles: 'ignore',
		extensions: ['js', 'json', 'wasm', 'html', 'css', 'map', 'scss'],
		index: false, // we want serve-index to handle this
	})
	, serveIndex(path.join(__dirname, '../node_modules'), { icons: true })
);


// Prevent access to sensitive files
app.use((req, res, next) => {
	const forbidden = ['server.js', 'package.json', 'package-lock.json'];
	if (forbidden.includes(req.url.slice(1))) {
		return res.status(403).send('Access Denied');
	}
	next();
});
//Create HTTP server to redirect to HTTPS
http.createServer((req, res) => {
	res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
	res.end();
}).listen(80, () => {
	console.log('🌐 HTTP server redirecting to HTTPS on port 80');
});
// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
	console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});
