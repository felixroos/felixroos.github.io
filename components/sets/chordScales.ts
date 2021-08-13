import { Scale, PcSet, Chord } from '@tonaljs/tonal'

export default (chord, scales = Scale.names(), includeRoot = false, fallbackScale = 'chromatic') => {
  const isSuperSet = PcSet.isSupersetOf(Chord.get(chord).chroma);
  let matches = scales.filter((scale) => isSuperSet(Scale.get(scale).chroma));
  if (!includeRoot) {
    return matches;
  }
  const [root] = Chord.tokenize(chord);
  if (!matches.length) {
    matches = [fallbackScale];
  }
  return matches.map(scale => `${root} ${scale}`);
}