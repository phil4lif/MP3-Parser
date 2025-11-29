import http from 'http';

interface mp3FrameHeader {
  frameLength: number;
  bitRate: number;
  sampleRate:number;
}

// Frame Header is 4 bytes long
// First byte is all 1s
// second byte starts with three 1s

function analyzeHeader(upload: Buffer):mp3FrameHeader {
  // If I called this  it is a potential frame header
  // use the dictionaries to check what these bits mean.

  const frameHeader = {
    frameLength: 0,
    bitRate: 0,
    sampleRate: 0,
  }
  return frameHeader;
}

const server = http.createServer((req, res) => {
  if (req.url?.toLowerCase() === '/file-upload' && req.method === 'POST') {
    let frameCount = 0;
    const bodyChunks: any[] = [];

    req.on('data', chunk => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      const mp3Buffer = Buffer.concat(bodyChunks);
      // Need to loop over through this buffer and check  if a byte is 255 and the next byte is >=224
      // Then it is a potential frameheader
      // if it is a potential frameheader I call analyzeHeader and get all the information I need.
      // And confirm that it is indeed a frame header....
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