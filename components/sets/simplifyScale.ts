import { Note, Scale } from '@tonaljs/tonal';
import totalAccidentals from './totalAccidentals';

export default (scale) => {
  const { tonic, type } = Scale.get(scale);
  const a = Note.simplify(tonic);
  const b = Note.enharmonic(a);
  const accidentals = tonic => totalAccidentals(Scale.get(`${tonic} ${type}`).notes)
  if (a === b || accidentals(a) <= accidentals(b)) {
    return `${a} ${type}`;
  }
  return `${b} ${type}`
}