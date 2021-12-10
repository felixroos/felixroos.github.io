import Accidentals from './Accidentals';
import Circle from './Circle';

export const stepNumbers = [0, 1, 2, 3, 4, 5, 6];
export const steps = [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6];

const Step = (_step) => ({
  name: _step,
  get abs() {
    return Step(this.tokens.slice(1).join(''));
  },
  get sign() {
    return this.tokens[0];
  },
  get number() {
    return this.tokens[2];
  },
  get index() {
    return this.number - 1;
  },
  get steps() {
    const steps = this.number - 1;
    return this.sign === '-' ? -steps : steps;
  },
  get tokens() {
    const [sign, accidentals, stepNumber] = _step.match(/^([\-\+]?)([#b]*)([1-9]+)$/).slice(1);
    return [sign, accidentals, parseInt(stepNumber)];
  },
  get accidentals() {
    return Accidentals(this.tokens[1]);
  },
  get semitones() {
    const abs = steps.indexOf(this.index % 7) + Math.floor(this.index / 7) * 12 + this.accidentals.offset;
    return this.sign === '-' ? -abs : abs;
  },
  invert() {
    const sign = this.sign === '-' ? '' : '-';
    const invertedSemitones = 12 - this.abs.semitones;
    const invertedNumber = 8 - this.index;
    const numberSemitones = steps.indexOf(invertedNumber - 1);
    return Step([sign, Accidentals(invertedSemitones - numberSemitones).stringify(), invertedNumber].join(''));
  },
  transpose(_step) {
    const step = Step(_step);
    const sum = this.steps + step.steps;
    const toStep = Circle(stepNumbers).item(sum);
    const semitoneOffset = step.semitones + this.semitones - steps.indexOf(toStep);
    const transposed = [sum < 0 ? '-' : '', Accidentals(semitoneOffset % 12).stringify(), Math.abs(sum) + 1].join('');
    return Step(transposed);
  },
});

export default Step;
