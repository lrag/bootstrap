// Servidor HTTP estático para el curso: entrega los ficheros de la raíz del workspace.
// Uso: node server.js  →  http://localhost:3000
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Página de inicio: lista los HTML de la raíz
function listarPaginas(res) {
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  const enlaces = paginas.map(f => `<li><a href="/${f}">${f}</a></li>`).join('\n');
  res.writeHead(200, { 'Content-Type': MIME['.html'] });
  res.end(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Curso de Bootstrap 5</title></head>
<body><h1>Curso de Bootstrap 5</h1><ul>${enlaces}</ul></body></html>`);
}

const server = http.createServer((req, res) => {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    return res.end('Petición incorrecta');
  }

  if (ruta === '/') return listarPaginas(res);

  // Evita salir de la raíz con rutas tipo /../
  const fichero = path.join(ROOT, path.normalize(ruta));
  if (!fichero.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    return res.end('Prohibido');
  }

  fs.readFile(fichero, (err, datos) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(`No encontrado: ${ruta}`);
    }
    const tipo = MIME[path.extname(fichero).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'no-cache' });
    res.end(datos);
  });

  console.log(`${req.method} ${ruta}`);
});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
