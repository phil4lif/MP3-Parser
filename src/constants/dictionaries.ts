interface Dictionary {
  [key: string]: string | number;
}
export const layerDescMap: Dictionary = {
  '00': 'reserved',
  '01': 'Layer III',
  '10': 'Layer II',
  '11': 'Layer I',
}

export const v1L3BitRateMap: Dictionary = {
  '0000': 'free',
  '0001': 32,
  '0010': 40,
  '0011': 48,
  '0100': 56,
  '0101': 64,
  '0110': 80,
  '0111': 96,
  '1000': 112,
  '1001': 128,
  '1010': 160,
  '1011': 192,
  '1100': 224,
  '1101': 256,
  '1110': 320,
  '1111': 'bad'
}

export const mpeg1SampleRateMap: Dictionary = {
  '00': 44100,
  '01': 48000,
  '10': 32000,
  '11': 'reserv.'
}

export const audioVersionIDMap: Dictionary = {
  '00': 'MPEG Version 2.5',
  '01': 'reserved',
  '10': 'MPEG Version 2',
  '11': 'MPEG Version 1'
}