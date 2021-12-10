import Accidentals from './Accidentals';
import Circle from './Circle';
import Step from './Step';

export const notes = ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'];
export const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const Note = (note) => ({
  note,
  get octave() {
    return this.tokens[2];
  },
  get letter() {
    return this.tokens[0];
  },
  get pc() {
    return this.tokens.slice(0, 2).join('');
  },
  transpose(_step) {
    const step = Step(_step);
    const steps = (this.index + step.index) * (step.sign === '-' ? -1 : 1);
    const toLetter = Circle(noteLetters).item(steps);
    const octaves = Math.floor(steps / 7);
    const semitoneOffset = step.semitones + this.semitones - notes.indexOf(toLetter) - octaves * 12;
    const newOctave = this.octave + octaves;
    const transposed = [toLetter, Accidentals(semitoneOffset % 12).stringify(), ...(newOctave ? [newOctave] : [])].join(
      ''
    );
    return Note(transposed);
  },
  get tokens() {
    const [letter, accidental, octave] = note.match(/^([A-G])([b#]*)([0-9]?)$/).slice(1);
    return [letter, accidental, ...(octave ? [parseInt(octave)] : [])];
  },
  get accidentals() {
    return Accidentals(this.tokens[1]);
  },
  get semitones() {
    return notes.indexOf(this.tokens[0]) + this.accidentals.offset;
  },
  get index() {
    return noteLetters.indexOf(this.tokens[0]);
  },
});

export default Note;
