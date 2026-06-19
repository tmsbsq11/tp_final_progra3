const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BACKEND = 'http://localhost:8080';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function proxyRequest(req, res, targetPath) {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: 'localhost:8080' },
  };

  const proxy = http.request(options, (backendRes) => {
    res.writeHead(backendRes.statusCode, backendRes.headers);
    backendRes.pipe(res);
  });

  proxy.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No se pudo conectar con el backend en localhost:8080');
  });

  req.pipe(proxy);
}

function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No encontrado');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url.startsWith('/api/') || url === '/api') {
    proxyRequest(req, res, req.url);
    return;
  }

  if (url === '/admin' || url.startsWith('/admin/')) {
    proxyRequest(req, res, req.url);
    return;
  }

  let filePath = path.join(ROOT, url === '/' ? 'index.html' : url);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    serveStatic(req, res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Frontend en http://localhost:${PORT}`);
  console.log(`Proxy API -> ${BACKEND}`);
});
