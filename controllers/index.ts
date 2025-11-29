import { layerDescMap, mpeg1SampleRateMap, v1L3BitRateMap } from '../constants/dictionaries.ts';

interface mp3FrameHeader {
  frameLength: number;
  bitRate: number;
  sampleRate: number;
}
function analyzeHeader(file: Buffer, i: number): mp3FrameHeader {
  // If I called this  it is a potential frame header
  // use the dictionaries to check what these bits mean.
  // most importantly calculate the length of this frame so the loop can jump to the next frame.
  // Look at the 4 bytes of the potential header frame convert to binary strings
  // would be more efficient to use the bitwise operators.
  const byte1 = file[i].toString(2).padStart(8, '0');
  const byte2 = file[i + 1].toString(2).padStart(8, '0');
  const byte3 = file[i + 2].toString(2).padStart(8, '0');
  const byte4 = file[i + 3].toString(2).padStart(8, '0');
  const bitRate = v1L3BitRateMap[byte3.substring(0, 4)];
  const sampleRate = mpeg1SampleRateMap[byte3[4] + byte3[5]];
  const paddingBit = parseInt(byte3[6]);
  const layerBits = byte2[5] + byte2[6];
  const layer = layerDescMap[layerBits]
  // console.log(bitRate, sampleRate, layer)
  const currentFrameLengthInBytes = Math.floor((144 * bitRate * 1000 / sampleRate) + paddingBit);
  if (layer !== 'Layer III') {
    console.log('in if layer is not III')
    const frameHeader = {
      frameLength: 1,
      bitRate: 0,
      sampleRate: 0,
    }
    return frameHeader;
  }
  // console.log(currentFrameLengthInBytes)
  const frameHeader = {
    frameLength: currentFrameLengthInBytes,
    bitRate: 0,
    sampleRate: 0,
  }
  return frameHeader;
}
export function analyzeBuffer(buffer: Buffer) {
  let frameCount = 0;
  let i = 0;
  
  while (i < buffer.byteLength - 128) {
    // console.log('i',i)
    // console.log(buffer[0])
    if (buffer[i] === 255 && buffer[i + 1] >= 224) {
      // Need to loop over through this buffer and check  if a byte is 255 and the next byte is >=224
      // Then it is a potential frameheader
      // if it is a potential frameheader I call analyzeHeader and get all the information I need.
      // And confirm that it is indeed a frame header....
      let data = analyzeHeader(buffer, i)
      if (data.frameLength) {
        i += data.frameLength;
        frameCount++;
      }
    } else {
      i++
    }
  }
  return frameCount;
}