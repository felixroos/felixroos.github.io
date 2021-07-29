import { Chord, Interval, Note, Range } from '@tonaljs/tonal';

export function tonalAliases(chord) {
  return Chord.get(chord)?.aliases?.length;
}

export function tokenizeChord