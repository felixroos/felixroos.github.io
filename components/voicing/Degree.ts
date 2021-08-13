import { Harmony } from './Harmony';
import { steps, Step } from './Step';
import { Chord, Note } from '@tonaljs/tonal';

export class Degree {
  /** Returns degree from step */
  static fromStep(step: string) {
    step = Step.from(step);
    const match = step.match(/([1-9])+/);
    if (!match || !match.length) {
      return 0;
    }
    return parseInt(match[0], 10);
  }
  static inChord(degree, chord) {
    chord = Harmony.getTonalChord(chord);
    const intervals = Chord.get(chord).intervals;
    const tokens = Chord.tokenize(chord);
    return Note.transpose(tokens[0], Degree.find(degree, intervals));
  }
  static fromInterval(interval = '-1', simplify = false) {
    const fixed = Harmony.reduceInterval(interval + '', simplify) || '';
    const match = fixed.match(/[-]?([1-9])+/);
    if (!match) {
      return 0;
    }
    return Math.abs(parseInt(match[0], 10));
  }
  static find(degreeOrStep: number | string, intervalsOrSteps: string[]) {
    const intervals = intervalsOrSteps.map(i => Harmony.isInterval(i) ? i : Step.toInterval(i));
    if (typeof degreeOrStep === 'number') { // is degree
      const degree = Math.abs(degreeOrStep);
      return intervals.find(i => {
        i = Harmony.minInterval(i, 'up');
        if (!steps[i]) {
          console.error('interval', i, 'is not valid', intervals);
        }
        return !!(steps[i].find(step => Degree.fromStep(step) === degree));
      });
    }
    // is step
    const step = Step.from(degreeOrStep);
    return intervals.find(i => i.includes(step) ||
      i === Step.toInterval(step));
  }
}