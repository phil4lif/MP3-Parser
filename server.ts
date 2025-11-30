import http from 'http';
import { analyzeBuffer } from './controllers/index.ts';



// Frame Header is 4 bytes long
// First byte is all 1s
// second byte starts with three 1s



const server = http.createServer((req, res) => {
  if (req.url?.toLowerCase() === '/file-upload' && req.method === 'POST') {
    const bodyChunks: any[] = [];

    req.on('data', chunk => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      const mp3Buffer = Buffer.concat(bodyChunks);
      const frameCount = analyzeBuffer(mp3Buffer);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        frameCount
      }))
    })

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }))
  }
})

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Listening on PORT:${PORT}`));