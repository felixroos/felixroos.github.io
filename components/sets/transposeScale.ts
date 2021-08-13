import { Scale, Range, Note, Collection } from '@tonaljs/tonal';
import scaleChroma from './scaleChroma';

export default (amount, scale) => {
  const { type } = Scale.get(scale);
  const roots = Range.chromatic(['C3', 'B3']).map((n) => Note.get(n).pc);
  const rotated = Collection.rotate((amount + 12) % 12, scaleChroma(scale).split('')).join('');
  const root = roots.find((r) => scaleChroma(`${r} ${type}`) === rotated);
  return root ? `${root} ${type}` : '';
};