import { Scale } from '@tonaljs/tonal';
import scaleChroma from './scaleChroma';

// find scalename for given chroma and tonic
export default (chroma, tonic, scaleTypes = Scale.names()) => {
  const type = scaleTypes.filter(type => scaleChroma(`${tonic} ${type}`) === chroma);
  if (type) {
    return `${tonic} ${type}`;
  }
  return '';
}