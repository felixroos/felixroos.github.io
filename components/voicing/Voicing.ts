import { Permutation } from '../../components/combinatorial-search/Permutation';
import { Harmony, intervalDirection } from './Harmony';
import { Chord, Note, Interval, Range } from '@tonaljs/tonal';
import { Degree } from './Degree';
import { Step } from './Step';

export class Voicing {
  static getCombinations(chord, options: VoicingValidation = {}) {
    const root = Harmony.getBassNote(chord);
    if (options.bottomDegrees && options.bottomDegrees.length) {
      options.bottomPitches = (options.bottomPitches || []).concat(
        (options.bottomDegrees as number[][])
          .map(degrees => degrees.map(degree => Degree.inChord(degree, chord)))
      );
    }
    if (options.topDegrees && options.topDegrees.length && typeof options.topDegrees[0] === 'number') {
      throw new Error('topDegrees should be a double nested array!');
    }
    if (options.topDegrees && options.topDegrees.length) {
      options.topPitches = (options.topPitches || []).concat(
        (options.topDegrees as number[][])
          .map(p => p.map(degree => Degree.inChord(degree, chord)))
      );
    }
    return Voicing.absolute({ ...Voicing.getPitches(chord, options), ...options, root });
  }

  static absolute(options: VoicingValidation = {}) {
    // interval in semitones => lowest starting note
    // set default options
    options = {
      ...voicingDefaultOptions,
      ...options
    };
    const {
      requiredPitches,
      optionalPitches,
      bottomPitches,
      topPitches,
      topNotes,
      voices,
      ignoreLowerIntervalLimits,
      bottomDistances,
      topDistances,
      preferTopDistances,
    } = options;
    let {
      range,
      defaultDistances,
    } = options;
    const pitches = [...(requiredPitches || []), ...(optionalPitches || [])];
    const bottomChromas = (bottomPitches || []).map(p => (p || []).map(n => Note.chroma(n)));
    const topChromas = (topPitches || []).map((p => (p || []).map(n => Note.chroma(n))));
    if (!pitches.length) {
      throw new Error('requiredPitches or optionalPitches must be set!');
    }
    let { minNotes, maxNotes } = {
      ...Voicing.getMinMaxNotes(options),
      ...options,
    }
    if (voices) {
      // each voice has own range
      if (maxNotes && maxNotes > voices.length) {
        throw new Error('maxNotes cannot be greater than the amount of voices');
      } // but can be smaller..
      maxNotes = maxNotes || voices.length;
      range = [voices[0][0], voices[voices.length - 1][1]];
    }
    if (!range) {
      throw new Error('no range given');
    }
    if (!minNotes) {
      minNotes = pitches.length;
    }
    if (!maxNotes) {
      maxNotes = pitches.length;
    }
    const allowedNotes = Range.chromatic(range).filter(Harmony.byPitches(pitches));
    return Permutation.search(
      (path: string[], solutions) => {
        if (!path.length) { // no notes picked yet
          /* if (bottomPitches && bottomPitches.length) {
            return allowedNotes.filter(n => bottomPitches.includes(Note.pc(n)));
          } */
          if (bottomChromas.length) {
            return allowedNotes.filter(n => bottomChromas[0].includes(Note.chroma(n)));
          }
          return allowedNotes;
        }
        if (path.length >= maxNotes) { // limit reached
          return [];
        }
        // determine min/max distance for current path
        let bottomDistance, topDistance;
        if (bottomDistances && bottomDistances[path.length - 1]) {
          bottomDistance = bottomDistances[path.length - 1];
        }
        if (minNotes === maxNotes && topDistances && topDistances[maxNotes - path.length - 1]) {
          // maybe could optimize for minNotes!==maxNotes
          topDistance = topDistances[maxNotes - path.length];
        }
        let distanceRange = [].concat(defaultDistances);
        if (bottomDistance && topDistance) { // clash
          distanceRange = preferTopDistances ? topDistance : bottomDistance;
        } else {
          distanceRange = bottomDistance || topDistance || distanceRange; //  || [minDistance, maxDistance];
        }
        return allowedNotes.filter( // only return notes above last pick
          note => {
            const noteMidi = Note.midi(note);
            const lastMidi = Note.midi(path[path.length - 1]);
            return noteMidi > lastMidi
              && (!distanceRange[1] || (noteMidi - lastMidi) <= distanceRange[1])
              && (!distanceRange[0] || (noteMidi - lastMidi) >= distanceRange[0])
              && (!bottomChromas[path.length] || bottomChromas[path.length].includes(Note.chroma(note)))
              && (ignoreLowerIntervalLimits || (!lowIntervalLimits[(noteMidi - lastMidi)] || noteMidi >= Note.midi(lowIntervalLimits[(noteMidi - lastMidi)])))
          }
        );
      },
      (solution) => {
        if (solution.length < minNotes) {
          return false;
        }
        if (requiredPitches && !requiredPitches.reduce(
          (hasAll, pitch) => hasAll && !!solution.find(n => Note.chroma(n) === Note.chroma(pitch)), true
        )) {
          return false;
        }
        /* if (topPitches && !topPitches.includes(Note.pc(solution[solution.length - 1]))) {
          return false;
        } */
        // TODO add other topChromas....
        /* if (topChromas[solution.length - 1] && !topChromas[solution.length - 1].includes(Note.chroma(solution[solution.length - 1]))) {
          return false;
        } */
        if (topNotes && !topNotes.includes(solution[solution.length - 1])) {
          return false;
        }
        if (topChromas && !topChromas.reduce((valid, chromas, i) => {
          const index = solution.length - topChromas.length + i;
          if (!index) {
            return valid;
          }
          return valid && chromas.includes(Note.chroma(solution[index]));
        }, true)) {
          //console.log('topChroma fail', topChromas, solution);
          return false;
        }

        if (topDistances && !topDistances.reduce((valid, distance, i) => {
          const index = solution.length - topDistances.length + i;
          if (!index) {
            return valid;
          }
          const d = (Note.midi(solution[index]) - Note.midi(solution[index - 1]));
          return valid && d >= distance[0] && d <= distance[1];
        }, true)) {
          return false;
        }
        if (voices && Array.isArray(voices)
          && voices.length
          && Array.isArray(voices[0])
          && Array.isArray(voices[1])
          && Voicing.allocations(solution, voices as string[][]).length === 0) {
          return false;
        }
        return true;
      }
    );
  }
  /* static allocations(notes: string[], voices: { [name: string]: string[] }) { */
  static allocations(notes: string[], voices: string[][]) {
    // sort voices by range top => bottom to top
    //const keys = Object.keys(voices).sort((a, b) => Note.midi(voices[a][1]) - Note.midi(voices[b][1]));
    const keys = voices.sort((a, b) => Note.midi(a[1]) - Note.midi(b[1])).map((v, i) => i);

    return Permutation.search(
      (path: number[], solutions) => {
        if (path.length > notes.length - 1) { // all notes voiced
          return [];
        }
        const note = notes[path.length];
        return keys.filter((v, i) =>
          !path.includes(i) // voice has already neem picked
          && i > keys.indexOf(keys[path.length - 1]) // voice is below last voice => would cross
          && Harmony.isInRange(note, voices[i])
        );
      },
      (solution) => {
        return solution.length === notes.length;
      }
    ); //.map(solution => solution.map(v => voices.indexOf(v)));
  }
  static getPitches(chord: string, options: VoicingValidation) {
    chord = Harmony.getTonalChord(chord);
    const pitches = Chord.get(chord).notes;
    options = {
      ...Voicing.getMinMaxNotes(options),
      ...options,
    }
    const requiredPitches = Voicing.getRequiredPitches(chord, options.maxNotes);
    const optionalPitches = pitches.filter(pitch => !requiredPitches.includes(pitch));
    return {
      requiredPitches,
      optionalPitches
    }
  }
  // just a wrapper to avoid possible future refactoring: correctly named
  static getRequiredPitches(chord, voices = 2) {
    return Voicing.getRequiredNotes(chord, voices);
  }
  /** Returns all notes that are required to outline a chord */
  static getRequiredNotes(chord, voices = 2) {
    chord = Harmony.getTonalChord(chord);
    const notes = Chord.get(chord).notes;
    const intervals = Chord.get(chord).intervals;
    let requiredSteps = [3, 7, 'b5', 6].slice(0, Math.max(voices, 2)); // order is important
    if (!Degree.find(3, intervals)) {
      requiredSteps.push(4); // fixes m6 chords
    }
    let required = requiredSteps.reduce((req, degree) => {
      if (!!Degree.find(degree, intervals)) {
        req.push(Degree.inChord(degree, chord));
      }
      return req;
    }, []);
    if (voices > 3 && !required.includes(notes[notes.length - 1])) {
      required.push(notes[notes.length - 1]);
    }
    return required;
  }
  static getMinMaxNotes(options: VoicingValidation) {
    let notes = options.notes || voicingDefaultOptions.notes;
    let minNotes, maxNotes;
    if (typeof notes === 'number') {
      minNotes = notes;
      maxNotes = notes
    } else if (Array.isArray(notes)) {
      if (notes.length < 2) {
        throw new Error('notes must be a number or an array with two numbers (max,min)');
      }
      minNotes = notes[0];
      maxNotes = notes[1];
    }
    if (minNotes > maxNotes) {
      throw new Error('minNotes cannot be greater than maxNotes');
    }
    return { minNotes, maxNotes };
  }
  static analyze(voicing, root) { // voicing with first note as bass
    const pitches = voicing.map(note => Note.get(note).pc);
    const steps = pitches.map(pitch => Step.fromInterval(Interval.distance(root, pitch)));
    const intervals = voicing.reduce((intervals, note, index) => index ? intervals.concat(
      [Interval.distance(voicing[index - 1] as string, note as string)]
    ) : [], []);
    const semitones = intervals.map(interval => Interval.semitones(interval));
    const minDistance = Math.min(...semitones);
    const maxDistance = Math.max(...semitones);
    const spread = Interval.distance(voicing[0], voicing[voicing.length - 1]);
    const semitoneSpread = Interval.semitones(spread as string);
    const avgSpread = Math.floor(semitoneSpread / voicing.length);
    const averageDistance = semitones.reduce((avg, semitones) => avg + semitones, 0) / semitones.length;
    const leapSemitones = maxDistance - minDistance;
    const leap = Interval.fromSemitones(leapSemitones);
    const topMidi = Note.midi(voicing[voicing.length - 1]);
    const topDegree = Degree.fromInterval(Interval.distance(root, pitches[pitches.length - 1]));
    const bottomDegree = Degree.fromInterval(Interval.distance(root, pitches[0]));
    const bottomMidi = Note.midi(voicing[0]);
    const midiMedian = voicing.reduce((sum, note) => sum + Note.midi(note), 0) / voicing.length;
    // TODO:
    // amount of different interval types: (3m 3M = 1) (4P 3m = 2)
    // standard deviation from median interval
    // degree stack: [1,[3,5,7]]
    return {
      root, pitches, maxDistance, minDistance, steps, intervals, semitones, spread, semitoneSpread, averageDistance, leap, leapSemitones,
      topMidi, bottomMidi, midiMedian, topDegree, bottomDegree, avgSpread
    }
  }
}

export declare type VoicingValidation = {

  /** COPIED FROM VoiceLeadingOptions to avoid typing errors */
  range?: string[];
  maxVoices?: number;
  forceDirection?: intervalDirection;
  forceBestPick?: boolean; // if true, the best pick will always be taken even if transposed an octave
  // the lower and upper distance to the range end that is tolerated before forcing a direction
  rangeBorders?: number[];
  logging?: boolean; // if true, all voice leading infos will be logged to the console
  idleChance?: number; // if true, next voicings cant use all the same notes again (difference !== 0)
  logIdle?: boolean; // if false, nothing will be logged if the notes stayed the same
  /** COPY END */

  // NEW
  requiredPitches?: string[];
  optionalPitches?: string[];
  bottomPitches?: string[][];
  topPitches?: string[][];
  voices?: string[][];
  ignoreLowerIntervalLimits?: boolean;
  defaultDistances?: number[];
  bottomDistances?: number[][];
  topDistances?: number[][];
  preferTopDistances?: boolean;
  maxTopDistance?: number;
  notes?: number | number[];

  maxDistance?: number;
  minBottomDistance?: number;
  minDistance?: number;
  minTopDistance?: number;
  topNotes?: string[]; // accepted top notes
  topDegrees?: number[][] | number[]; // accepted top degrees
  bottomNotes?: string[]; // accepted top notes
  bottomDegrees?: number[] | number[][]; // accepted bottom degrees
  omitNotes?: string[];
  unique?: boolean; // if true, no pitch can be picked twice
  maxNotes?: number; // if true, no pitch can be picked twice
  minNotes?: number; // if true, no pitch can be picked twice
  /* custom validator for permutation of notes */
  validatePermutation?: (path: string[], next: string, array: string[]) => boolean;
  /* Custom sort function for choices. Defaults to smaller difference. */
  sortChoices?: (choiceA, choiceB) => number;
  filterChoices?: (choice) => boolean;
  noTopDrop?: boolean;
  noTopAdd?: boolean;
  noBottomDrop?: boolean;
  noBottomAdd?: boolean;
  root?: string; // validate relative to that root
};
export const voicingDefaultOptions = {
  range: ['C3', 'C5'],
  notes: 4,
  rangeBorders: [3, 3],
  maxVoices: 4,
  forceDirection: null,
  forceBestPick: false,
  maxDistance: 7,
  defaultDistances: [1, 7],
  minBottomDistance: 3, // min semitones between the two bottom notes
  minTopDistance: 2, // min semitones between the two top notes
  noTopDrop: true,
  noTopAdd: true,
  noBottomDrop: false,
  noBottomAdd: false,
  idleChance: 1,
  logIdle: false,
  logging: true,
}

export const lowIntervalLimits = {
  1: 'E3',
  2: 'Eb3',
  3: 'C3',
  4: 'Bb2',
  5: 'Bb2',
  6: 'B2',
  7: 'Bb1',
  8: 'F2',
  9: 'F2',
  10: 'F2',
  11: 'F2',
};