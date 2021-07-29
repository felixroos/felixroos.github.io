import { tokenizeChord } from './tokenizeChord';
import { toTonalChordSymbol } from './toTonalChordSymbol';

export function toTonalChord(chord) {
  const [root, symbol] = tokenizeChord(chord);
  if (!root) {
    console.warn('unrecognized chord', chord)
    return (root || '') + (chord || '');
  }
  return (root || '') + toTonalChordSymbol(symbol);
}