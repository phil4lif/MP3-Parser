import http from 'http';
import { analyzeBuffer } from './controllers/index.ts';

const server = http.createServer((req, res) => {
  if (req.url?.toLowerCase() === '/file-upload' && req.method === 'POST') {
    const bodyChunks: Uint8Array[] = [];

    req.on('data', chunk => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      const mp3Buffer = Buffer.concat(bodyChunks);
      const { frameCount, error } = analyzeBuffer(mp3Buffer);

      if (error) {
        res.writeHead(415, error.message);
        res.end(JSON.stringify({error: error.message}));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          frameCount
        }))
      }

    })

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
})

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Listening on PORT:${PORT}`));