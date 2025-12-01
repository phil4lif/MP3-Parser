import { layerDescMap, mpeg1SampleRateMap, v1L3BitRateMap } from '../constants/dictionaries.ts';

interface AnalysisResult {
  valid: boolean;
  nextIncrement: number;
  error: Error | null;
}

function analyzeHeader(file: Buffer, i: number): AnalysisResult {
  const byte2 = file[i + 1].toString(2).padStart(8, '0');
  const byte3 = file[i + 2].toString(2).padStart(8, '0');
  const audioVersionBits = byte2.substring(3,5)

  if (audioVersionBits === '01') {
    return {
      valid: false,
      nextIncrement: 0,
      error: new Error('Unsupported Media Type'),
    }
  }

  const bitRate = v1L3BitRateMap[byte3.substring(0, 4)];
  const sampleRate = mpeg1SampleRateMap[byte3[4] + byte3[5]];
  const paddingBit = parseInt(byte3[6]);
  const layerBits = byte2[5] + byte2[6];
  const layer = layerDescMap[layerBits]
  const currentFrameLengthInBytes = Math.floor((144 * bitRate * 1000 / sampleRate) + paddingBit);

  const result: AnalysisResult = {
    nextIncrement: currentFrameLengthInBytes,
    valid: true,
    error: null,
  }
  if (i+ currentFrameLengthInBytes > file.byteLength - 128 || layer !== 'Layer III' || bitRate === 'bad' || bitRate === 'free' || sampleRate === 'reserv.') {
    result.nextIncrement = 1;
    result.valid = false;
    }
  return result;
}
export function analyzeBuffer(buffer: Buffer):{frameCount: number, error: Error | null} {
  let frameCount = 0;
  let i = 0;
  let error = null;
  
  while (i < buffer.byteLength - 128) {
    
    if (buffer[i] === 255 && buffer[i + 1] >= 224) {
      const data = analyzeHeader(buffer, i);
      if (data.error) {
        return {frameCount, error: data.error}
      }
      if (data.valid) {
        frameCount++;
      i += data.nextIncrement;
      } else {
        i += data.nextIncrement;
      }
    } else {
      i++;
    }
  }
  return {frameCount, error};
}