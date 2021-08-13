import { Chord, PcSet } from '@tonaljs/tonal';

export default (chord) => PcSet.get(Chord.get(chord).notes).chroma;