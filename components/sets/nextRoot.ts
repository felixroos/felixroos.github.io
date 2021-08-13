import { Note, Scale } from '@tonaljs/tonal';
import nextOne from './nextOne';
import reorderChroma from './reorderChroma';
import scaleChroma from './scaleChroma';

export default (scale, step = 1, pc = Scale.get(scale).tonic) => {
  const { notes } = Scale.get(scale);
  const chroma = reorderChroma(scaleChroma(scale), step);
  const currentIndex = (Note.chroma(pc) * step) % 12; // chromatic to circular index
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12;
  return notes.find(note => Note.chroma(note) === nextIndex);
};
