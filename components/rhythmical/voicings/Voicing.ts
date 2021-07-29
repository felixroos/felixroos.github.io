import { Chord, Note, Range, Interval } from '@tonaljs/tonal'

// VoicingDictionary
// Maps a chord symbol to a set of voicings (interval string). The Voicings package could provide a set of common voicings.

export declare type VoicingDictionary = { [symbol: string]: string[] };
export declare type VoicingDictionaryInterface = {
  [name: string]: VoicingDictionary
}

export const VoicingDictionary: VoicingDictionaryInterface = {
  triads: {
    M: ['1P 3M 5P', '3M 5P 8P', '5P 8P 10M'],
    m: ['1P 3m 5P', '3m 5P 8P', '5P 8P 10m'],
    o: ['1P 3m 5d', '3m 5d 8P', '5d 8P 10m'],
    aug: ['1P 3m 5A', '3m 5A 8P', '5A 8P 10m'],
  },
  lefthand: {
    m7: ['3m 5P 7m 9M', '7m 9M 10m 12P'],
    '7': ['3M 6M 7m 9M', '7m 9M 10M 13M'],
    '^7': ['3M 5P 7M 9M', '7M 9M 10M 12P'],
    '69': ['3M 5P 6A 9M'],
    'm7b5': ['3m 5d 7m 8P', '7m 8P 10m 12d'],
    '7b9': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
    '7b13': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
    'o7': ['1P 3m 5d 6M', '5d 6M 8P 10m'],
    '7#11': ['7m 9M 11A 13A'],
    '7#9': ['3M 7m 9A'],
    'mM7': ['3m 5P 7M 9M', '7M 9M 10m 12P'],
    'm6': ['3m 5P 6M 9M', '6M 9M 10m 12P'],
  },
  all: {
    M: ['1P 3M 5P', '3M 5P 8P', '5P 8P 10M'],
    m: ['1P 3m 5P', '3m 5P 8P', '5P 8P 10m'],
    o: ['1P 3m 5d', '3m 5d 8P', '5d 8P 10m'],
    aug: ['1P 3m 5A', '3m 5A 8P', '5A 8P 10m'],
    m7: ['3m 5P 7m 9M', '7m 9M 10m 12P'],
    '7': ['3M 6M 7m 9M', '7m 9M 10M 13M'],
    '^7': ['3M 5P 7M 9M', '7M 9M 10M 12P'],
    '69': ['3M 5P 6A 9M'],
    'm7b5': ['3m 5d 7m 8P', '7m 8P 10m 12d'],
    '7b9': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
    '7b13': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
    'o7': ['1P 3m 5d 6M', '5d 6M 8P 10m'],
    '7#11': ['7m 9M 11A 13A'],
    '7#9': ['3M 7m 9A'],
    'mM7': ['3m 5P 7M 9M', '7M 9M 10m 12P'],
    'm6': ['3m 5P 6M 9M', '6M 9M 10m 12P'],
  }
}


// VoiceLeading

export declare type VoiceLeadingFunction = (voicings: string[][], lastVoicing: string[]) => string[];

// A function that decides which of a set of voicings is picked as a follow up to lastVoicing.

export declare interface VoiceLeadingInterface {
  [name: string]: VoiceLeadingFunction
}

export const VoiceLeading: VoiceLeadingInterface = {
  topNoteDiff: (voicings, lastVoicing) => {
    if (!lastVoicing) {
      return voicings[0];
    }
    const diff = (voicing) => Math.abs(Note.midi(lastVoicing[lastVoicing.length - 1]) - Note.midi(voicing[voicing.length - 1]));
    return voicings.sort((a, b) => diff(a) - diff(b))[0]
  }
}

export declare interface VoicingInterface {
  defaultRange: string[],
  defaultDictionary: VoicingDictionary,
  defaultVoiceLeading: VoiceLeadingFunction,
  search(chord: string, range?: string[], dictionary?: VoicingDictionary): string[][],
  get(chord: string, range?: string[], dictionary?: VoicingDictionary, voiceLeading?: VoiceLeadingFunction, lastVoicing?: string[]): string[],
  sequence(chords: string[], range?: string[], dictionary?: VoicingDictionary, voiceLeading?: VoiceLeadingFunction): string[][],
  analyze?(voicing: string[]): {
    topNote: string,
    bottomNote: string,
    midiAverage: number
  }
  analyzeTransition?(from: string[], to: string[]): {
    topNoteDiff: number,
    bottomNoteDiff: number,
    movement: number
  }
  enharmonicEquivalent?(note: string, pitchClass: string): string
}

// Voicing
// A collection of functions to generate chord voicings
export const Voicing: VoicingInterface = {
  defaultRange: ['C3', 'C5'], // TODO: check
  defaultDictionary: VoicingDictionary.all,
  defaultVoiceLeading: VoiceLeading.topNoteDiff,
  // returns the best voicing for a chord after the optional lastVoicing, using voiceLeading. Internally calls Voicing.search to generate the available voicings.
  get: (chordSymbol, range = Voicing.defaultRange, dictionary = Voicing.defaultDictionary, voiceLeading, lastVoicing?) => {
    let voicings = Voicing.search(chordSymbol, range, dictionary);
    const { aliases } = Chord.get(chordSymbol);
    const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
    if (!symbol) {
      console.log(`no voicings found for chord "${chordSymbol}"`);
      return [];
    }
    let notes;
    if (!lastVoicing?.length) {
      //notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
      notes = voicings[0]; // pick lowest voicing..
    } else {
      // calculates the distance between the last note and the given voicings top note
      // sort voicings with differ
      notes = voiceLeading(voicings, lastVoicing);
    }
    return notes;
  },
  // returns all possible voicings of the given chord, as defined in the dictionary, inside the given range
  search: (chord, range = ['D3', 'A4'], dictionary = VoicingDictionary.triads): string[][] => {
    let [tonic, symbol] = Chord.tokenize(chord);
    if (!dictionary[symbol]) {
      const { aliases } = Chord.get(chord);
      if (!!aliases.length) {
        symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol)) || null;
      }
    }
    // find equivalent symbol that is used as a key in dictionary:
    if (!symbol || !dictionary[symbol]) {
      return [];
    }
    // resolve array of interval arrays for the wanted symbol
    const voicings = dictionary[symbol].map(intervals => intervals.split(' '));
    const notesInRange = Range.chromatic(range) // gives array of notes inside range
    return voicings.reduce((voiced: string[][], voicing: string[]) => {
      // transpose intervals relative to first interval (e.g. 3m 5P > 1P 3M)
      const relativeIntervals = voicing.map(interval => Interval.substract(interval, voicing[0]));
      // get enharmonic correct pitch class the bottom note
      const bottomPitchClass = Note.transpose(tonic, voicing[0]);
      // get all possible start notes for voicing
      const starts = notesInRange
        // only get the start notes:
        .filter(note => Note.chroma(note) === Note.chroma(bottomPitchClass))
        // filter out start notes that will overshoot the top end of the range
        .filter(note => Note.midi(Note.transpose(note, relativeIntervals[relativeIntervals.length - 1])) <= Note.midi(range[1]))
        // replace Range.chromatic notes with the correct enharmonic equivalents
        .map(note => enharmonicEquivalent(note, bottomPitchClass))
      // render one voicing for each start note
      const notes = starts.map(start => relativeIntervals.map(interval => Note.transpose(start, interval)));
      return voiced.concat(notes);
    }, [])
  },
  // voices all given chords, using the specified voiceLeading function between each
  sequence: (chords, range?, dictionary?, voiceLeading?, lastVoicing?) => {
    const { voicings } = chords.reduce(
      ({ voicings, lastVoicing }, chord) => {
        const voicing = Voicing.get(chord, range, dictionary, voiceLeading, lastVoicing);
        lastVoicing = voicing;
        voicings.push(voicing)
        return { voicings, lastVoicing }
      }, { voicings: [], lastVoicing }
    )
    return voicings;
  }
}

// returns enharmonic equivalents of note for pitchClass.
export function enharmonicEquivalent(note: string, pitchClass: string): string {
  const { alt, letter } = Note.get(pitchClass);
  let { oct } = Note.get(note);
  const letterChroma = Note.chroma(letter) + alt;
  if (letterChroma > 11) {
    oct--;
  } else if (letterChroma < 0) {
    oct++;
  }
  return pitchClass + oct;
}

export function* infiniteGenerator() {
  let state = '';
  while (true) {
    state += yield state;
  }
}

export function* voicingGenerator({ range, dictionary, voiceLeading }) {
  let lastVoicing;
  let chord;
  while (true) {
    lastVoicing = chord ? Voicing.get(chord, range, dictionary, voiceLeading, lastVoicing) : [];
    chord = yield lastVoicing;
  }
}