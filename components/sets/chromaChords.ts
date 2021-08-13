import { ChordType } from '@tonaljs/tonal';
import chordChroma from './chordChroma';

// find scalename for given chroma and tonic
export default (chroma, tonic, chordTypes = ChordType.names()) => {
  const type = chordTypes.filter(type => chordChroma(`${tonic} ${type}`) === chroma);
  if (type) {
    return `${tonic} ${type}`;
  }
  return '';
}