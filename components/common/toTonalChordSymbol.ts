import { Chord } from '@tonaljs/tonal';
import { tokenizeChord } from './tokenizeChord';


export const toTonalChordSymbol = (symbol) => {
  const isSupported = symbol => Chord.get('C' + symbol).aliases.includes(symbol);
  if (isSupported(symbol)) {
    return symbol;
  }
  const alternatives = {
    '-7': 'm7',
    '-': 'm',
    '-6': 'm6',
    '-11': 'm11',
    '-^7': 'mM7',
    '-9': 'm9',
    '-b6': 'mb6',
    '69': '69',
    '7b13sus': '7b13sus',
    '-69': 'm69',
    '7susadd3': '7susadd3',
    '-7b5': 'm7b5'
  };
  if (alternatives?.[symbol] && isSupported(alternatives?.[symbol])) {
    return alternatives?.[symbol];
  }
  console.warn('unsupported symbol ', symbol);
  return symbol;
  // return 'unsupported###' + symbol;
}
