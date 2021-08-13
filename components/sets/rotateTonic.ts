import { Note, Scale } from '@tonaljs/tonal';
import chromaScale from './chromaScale';
import scaleChroma from './scaleChroma';

export default (amount, scale, scaleTypes = Scale.names()) => {
  const { tonic, notes } = Scale.get(scale);
  const chroma = scaleChroma(scale);
  const t = notes.indexOf(notes.find(n => Note.get(n).pc === Note.get(tonic).pc));
  const newTonic = notes[(t + amount + notes.length) % notes.length];
  return chromaScale(chroma, newTonic, scaleTypes);
}