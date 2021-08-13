// TBD: find all symbols (scales / chords / intervals) that match the given chroma

import { ChordType, Interval, Scale } from '@tonaljs/tonal'
import chromaChords from './chromaChords'
import chromaScales from './chromaScales'

export default function chromaSymbols(chroma, tonic, symbols) {
  symbols = {
    scales: symbols.scales || Scale.names(),
    chords: symbols.chords || ChordType.names(),
    intervals: symbols.intervals || Interval.names(),
  }
  // TBD: what if tonic is unknown?! => get ones and check each
  return {
    scales: chromaScales(chroma, tonic),
    chords: chromaChords(chroma, tonic), // maybe try Chord.detect
  }
}