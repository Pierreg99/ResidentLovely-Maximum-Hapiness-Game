import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 8080);
const types = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (path.split('/').some(part => part.startsWith('.'))) throw new Error('Private path');
    if (path.endsWith('/')) path += 'index.html';
    const filename = resolve(root, '.' + path);
    if (!filename.startsWith(root + sep) || !(await stat(filename)).isFile()) throw new Error('Missing file');
    const data = await readFile(filename);
    response.writeHead(200, { 'Content-Type': (types[extname(filename)] || 'application/octet-stream'), 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (_) { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Resident Lovely: http://localhost:${port}`));
