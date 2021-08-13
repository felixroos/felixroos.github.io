import { Interval, Note, Range, Chord, Collection } from '@tonaljs/tonal';

export class Harmony {
  // CHORD additions
  // mapping for ireal chords to tonal symbols, see getTonalChord
  static irealToTonal = {
    "^7": "M7",
    "7": "7",
    "-7": "m7",
    "h7": "m7b5",
    "7#9": "7#9",
    "7b9": "7b9",
    "^7#5": "M7#5",
    "^#5": "M#5",
    "": "",
    "^": "M",
    "6": "6",
    "9": "9",
    "-6": "m6",
    "o7": "o7",
    "h": "m7b5",
    "-^7": "mM7",
    "o": "o",
    "^9": "M9",
    "7#11": "7#11",
    "7#5": "7#5",
    "-": "m",
    "7sus": "7sus",
    "69": "69",
    "7b13": "7b13",
    "+": "+",
    "7b9b5": "7b5b9",
    "-9": "m9",
    "9sus": "9sus",
    "7b9sus": "7b9sus",
    "7b9#5": "7#5b9",
    "13": "13",
    "^7#11": "M7#11",
    "-7b5": "m7b5",
    "^13": "M13",
    "7#9b5": "7b5#9",
    "-11": "m11",
    "11": "11",
    "7b5": "7b5",
    "9#5": "9#5",
    "13b9": "13b9",
    "9#11": "9#11",
    "13#11": "13#11",
    "-b6": "mb6",
    "7#9#5": "7#5#9",
    "-69": "m69",
    "13sus": "13sus",
    "^9#11": "M9#11",
    "7b9#9": "7b9#9",
    "sus": "sus",
    "sus4": "Msus4",
    "sus2": "Msus2",
    "7#9#11": "7#9#11",
    "7b9b13": "7b9b13",
    "7b9#11": "7b9#11",
    "13#9": "13#9",
    "9b5": "9b5",
    "-^9": "mM9",
    "2": "Madd9",
    "-#5": "m#5",
    "7+": "7#5",
    "7sus4": "7sus", // own addition
    "M69": "M69", // own addition
    // "5": "5",
    // "7b13sus": "7b13sus",
  };
  static getBassNote(chord: string, ignoreSlash = false) {
    if (!chord) {
      return null;
    }
    if (!ignoreSlash && chord.includes('/')) {
      return chord.split('/')[1];
    }
    const match = chord.match(/^([A-G][b|#]?)/);
    if (!match || !match.length) {
      return '';
    }
    return match[0];
  }
  // Chord.inversions
  static chordInversions(symbol, tonic, range) {
    const pitches = Chord.getChord(symbol, tonic).notes.map(note => Note.get(note).pc);
    const notesInRange = Range.chromatic(range).filter(Harmony.byPitches(pitches));
    const inversions = notesInRange.length - pitches.length + 1;
    if (inversions <= 0) {
      return [];
    }
    return Array.from({ length: notesInRange.length - pitches.length + 1 }, (_, i) => Collection.rotate(i, notesInRange).slice(0, pitches.length))
  }
  /*
    Harmony.chordInversions('-7', 'D', ['D3', 'A4'])
    [
      ["D3", "F3", "A3", "C4"],
      ["F3", "A3", "C4", "D4"],
      ["A3", "C4", "D4", "F4"],
      ["C4", "D4", "F4", "A4"]
    ]
  */
  static tokenizeChord(chord: string) {
    if (!chord) {
      return null;
    }
    const root = Harmony.getBassNote(chord, true) || '';
    let symbol = chord.replace(root, '');
    symbol = symbol.split('/')[0]; // ignore slash
    // check if already a proper tonal chord
    if (!!Object.keys(Harmony.irealToTonal).find(i => Harmony.irealToTonal[i] === symbol)) {
      return root + symbol;
    }
    return [root, symbol];
  }
  // add ireal chords to tonal
  static getTonalChord(chord: string) {
    if (!chord) {
      return null;
    }
    const root = Harmony.getBassNote(chord, true) || '';
    let symbol = chord.replace(root, '');
    symbol = symbol.split('/')[0]; // ignore slash
    // check if already a proper tonal chord
    if (!!Object.keys(Harmony.irealToTonal).find(i => Harmony.irealToTonal[i] === symbol)) {
      return root + symbol;
    }
    symbol = Harmony.irealToTonal[symbol];
    if (symbol === undefined) {
      return null;
    }
    return root + symbol;
  }
  // INTERVAL ADDITIONS
  // use Interval.ic?
  static minInterval(interval, direction?: intervalDirection, noUnison?) {
    interval = Harmony.reduceInterval(interval, true);
    if (direction) {
      return Harmony.forceDirection(interval, direction, noUnison)
    }
    let inversion = Harmony.invertInterval(interval);
    if (Math.abs(Interval.semitones(inversion)) < Math.abs(Interval.semitones(interval))) {
      interval = inversion;
    }
    return interval;
  }
  /** Reduces interval into one octave (octave+ get octaved down) */
  static reduceInterval(interval = '', simplify = false) {
    let fix: { [key: string]: string } = {
      '0A': '1P',
      '-0A': '1P',
      /*  */
    }
    if (simplify) {
      fix = {
        ...fix,
        '8P': '1P',
        '-8P': '1P',
        /* '-1A': '-2m',
        '1A': '2m',
        '8d': '7M',
        '-8d': '-7M', */
      }
      interval = Interval.simplify(interval);
    }
    if (Object.keys(fix).includes(interval)) {
      return fix[interval];
    }
    return interval;
  }
  /** inverts the interval if it does not go to the desired direction */
  static forceDirection(interval, direction: intervalDirection, noUnison = false) {
    const semitones = Interval.semitones(interval);
    if ((direction === 'up' && semitones < 0) ||
      (direction === 'down' && semitones > 0)) {
      return Harmony.invertInterval(interval);
    }
    if (interval === '1P' && noUnison) {
      return (direction === 'down' ? '-' : '') + '8P';
    }
    return interval;
  }
  static invertInterval(interval) {
    if (!interval) {
      return null;
    }
    const positive = interval.replace('-', '');
    const complement = Harmony.intervalComplement(positive);
    const isNegative = interval.length > positive.length;
    return (isNegative ? '' : '-') + complement;
  }
  static intervalComplement(interval) {
    const fix = {
      '8P': '1P',
      '8d': '1A',
      '8A': '1d',
      '1A': '8d',
      '1d': '8A',
    }
    const fixIndex = Object.keys(fix).find(key => interval.match(key));
    if (fixIndex) {
      return fix[fixIndex];
    }
    return Interval.invert(interval);
  }
  static isInterval(interval) {
    return typeof Interval.semitones(interval) === 'number';
  }
  // RANGE ADDITIONS
  // Range.includes(note, range) => true if note is inside range
  static isInRange(note, range: string[]) {
    const m = Note.midi(note);
    return Note.midi(range[0]) <= m && m <= Note.midi(range[1]);
  }
  // Range.byPitches
  static byPitches(pitches) {
    const chromas = pitches.map(pitch => Note.chroma(pitch));
    return (note) => chromas.includes(Note.chroma(note))
  }
}
export declare type intervalDirection = 'up' | 'down';
