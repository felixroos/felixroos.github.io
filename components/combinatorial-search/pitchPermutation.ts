import { Range, Note } from '@tonaljs/tonal';
import { flatObject } from '../rhythmical/helpers/objects';
import { mean, sum } from 'd3-array';
import { interpolateWarm, interpolateSinebow } from 'd3-scale-chromatic';
import { enharmonicEquivalent } from '../rhythmical/voicings/enharmonicEquivalent';

export function pitchPermutation(pitches, path = []) {
  if (!pitches.length) {
    return [path];
  }
  return pitches.reduce((c, pitch) => c.concat(
    pitchPermutation(
      pitches.filter(p => p !== pitch),
      path.concat([pitch])
    )
  ), []);
}

export function renderUp(pitches, bottomOctave) {
  const res = [];
  let octave = bottomOctave;
  pitches.forEach((pitch, index) => {
    if (index && Note.chroma(pitches[index - 1]) >= Note.chroma(pitch)) {
      octave += 1;
    }
    res.push(pitch + octave)
  })
  return res;
}

export function pitchesInRange(pitches, range = ['C3', 'C5']) {
  return Range.chromatic(range).filter(note => pitches.find(
    (pitch) => Note.chroma(pitch) === Note.chroma(note)
  )).map(note => enharmonicEquivalent(note, pitches.find(pitch => Note.chroma(pitch) === Note.chroma(note))))
}

export function setsInRange(pitches, range = ['D3', 'A4']) {
  const notesInRange = Range.chromatic(range) // gives array of notes inside range
  // get all possible start notes for voicing
  const starts = notesInRange
    // only get the start notes:
    .filter(note => Note.chroma(note) === Note.chroma(pitches[0]))
    // replace Range.chromatic notes with the correct enharmonic equivalents
    .map(note => enharmonicEquivalent(note, pitches[0]))
  // render one voicing for each start note
  return starts.map(start => renderUp(pitches, Note.octave(start)))
    // filter out voicings that contain notes that overshoot
    .filter(notes => !notes.find(note => Note.midi(note) > Note.midi(range[1])));
}

export function permutateVoicings(pitches, range) {
  return pitchPermutation(pitches).reduce(
    (voicings, combination) =>
      voicings.concat(setsInRange(combination, range)),
    []
  )
}

/* console.log(pitchPermutation(['C', 'E', 'G']))
console.log(pitchPermutation(['C', 'E', 'G']).map(p => renderUp(p, 3))) */
/* console.log(setsInRange(['C', 'E', 'G'], ['C3', 'C6'])) */



export function permutateTreeUnique(array, path = []) {
  let available = array.filter((c) => !path.includes(c));
  if (available.length === 0) {
    return {
      name: `${path[path.length - 1]} - ${path.join('')}`
    };
  }
  return {
    name: path.length ? path[path.length - 1] : '',
    children: available.map((e) =>
      permutateTreeUnique(array, path.concat([e]))
    )
  };
};


export function colorID(combination, origin) {
  const maxId = parseInt(Array.from({ length: combination.length }, (_, i) => combination.length - i + 1).join(''), 10);
  const number = parseInt(combination.map(item => origin.indexOf(item) + 1).join(''), 10);
  const fraction = number / maxId;
  return interpolateSinebow(fraction);
}

export declare type PermutationChild<T> = { name: T | string, path: T[], isValid: boolean, children: PermutationChild<T>[] }
export declare type PermutationOptions<T> = {
  find: (path: T[], solutions: T[][]) => T[], // finds new candidates
  validate: (path: T[], solutions: T[][]) => boolean, // validates paths to become solutions
  map?: (child: PermutationChild<T>) => any
}

export function permutate<T>(
  options: PermutationOptions<T>,
  path: T[] = [], // current path (picked candidates)
  solutions = []) // found solutions (valid paths)
{
  let { find, validate, map } = options;
  map = map || (e => e);
  const candidates = find(path, solutions);
  const isValid = validate(path, solutions);
  if (isValid) {
    solutions.push(path);
  }
  return map({
    name: path[path.length - 1] ?? '',
    path,
    isValid,
    children: candidates.map((e) =>
      permutate(options, path.concat([e]), solutions)
    )
  })
};

export function permutateTree<T>(array: T[], options: any = { unique: true }, path: T[] = [], solutions = []) {
  let { unique, max, filter, min } = options;
  max = max || array.length;
  min = min || max;
  let available = array;
  if (unique) {
    available = array.filter((c) => !path.includes(c));
  }
  if (filter) {
    available = available.filter(e => filter(e, path, array, max))
  }
  if (max && path.length >= max) {
    available = [];
  }
  if (available.length === 0) {
    if (path.length < min) {
      return false;
    }
    return {
      name: path[path.length - 1] ?? '',
      isLeaf: true,
      isValid: true,
      color: colorID(path, array),
      path: path
    };
  }
  return {
    name: path[path.length - 1] ?? '',
    path: path,
    // color: colorID(path, array),
    isLeaf: false,
    isValid: true,
    children: available.map((e, i) =>
      permutateTree(array, options, path.concat([e]))
    ).filter(child => !!child)
  };
};

// takes tree and flattens it to 2D pitch array
export function flatTree(tree) {
  return flatObject(tree, {
    isDeep: ({ children }) => children?.length,
    getChildren: ({ children }) => children
  } as any)
    .filter(({ isValid }) => isValid)
    .map(({ path }) => path);
}

// takes tree and flattens it to 2D pitch array
export function flatPermutations(elements, options) {
  return flatTree(permutateTree(elements, options));
}

// takes 2D pitch array and arranges all possible transpositions
export const arrangePermutations = (range = ['C3', 'C5']) => (voicings, combination) => {
  return voicings.concat(
    setsInRange(combination, range).map((notes) => ({
      parallel: notes,
    }))
  );
}

export function sortByMeanMidi(a, b) {
  return mean(a.parallel.map((n) => Note.midi(n))) -
    mean(b.parallel.map((n) => Note.midi(n)))
}
