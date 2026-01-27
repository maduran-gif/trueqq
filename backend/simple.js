const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hola desde Node.js\n');
});

server.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});