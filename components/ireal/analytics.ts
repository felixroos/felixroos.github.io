import { Interval } from '@tonaljs/tonal';
import { sum } from 'd3-array';

export declare type CountedSet<T> = Array<{ value: T, count: number, regularity: number }>;

export function unique(values = []) {
  return values.filter((c, i, a) => a.indexOf(c) === i)
}

export function countUniques(objects: Object[], props: string[]): { [key: string]: { value: any, count: number }[] } {
  const uniques = props.reduce((p, key) => ({ ...p, [key]: [] }), {});
  for (let i = 0; i < objects.length; ++i) {
    for (let j = 0; j < props.length; ++j) {
      const toMatch = objects[i][props[j]];
      let match = uniques[props[j]].find(({ value }) => toMatch === value);
      if (!match) {
        match = { value: toMatch, count: 1 };
        uniques[props[j]].push(match);
      }
      match.count += 1;
    }
  }
  props.forEach(prop => {
    uniques[prop] = uniques[prop].sort((a, b) => b.count - a.count)
  })
  return uniques;
}

export function countUnique<T>(values: T[] = []): CountedSet<T> {
  return unique(values)
    .map((value, i, set) => {
      const count = values.filter((v) => v === value).length;
      return {
        // count items that have the value
        value,
        count,
        regularity: count / values.length
      }
    });
}

export function averageRegularity<T>(items: T[], set: CountedSet<T>) {
  return sum(set.filter(item => items.includes(item.value)).map(item => item.regularity)) / items.length;
}

export function getChord(_chord) {
  const [chord, bass] = (_chord || '').split('/');
  const symbol = chord.replace(/[A-G][b#]*/g, '');
  return {
    root: chord.replace(symbol, ''),
    symbol: !symbol || symbol === '^' ? 'M' : symbol,
    bass
  };
}

export function includesTransitions(transitions, relative = true, semitones = false) {
  return (song, index) => {
    const t = parseTransitions([song], relative, semitones).map((t) => t.value);
    /* if (index === 5) {
      console.log('t', t, transitions);
    } */
    return transitions.reduce(
      (match, transition) => match && t.find((value) => value === transition),
      true
    );
  };
}

export function includesChords(chords, relative) {
  return (song, index) => {
    const t = parseChords([song], relative).map((t) => t.value);
    return chords.reduce(
      (match, chord) => match && t.find((value) => value === chord),
      true
    );
  };
}

declare type SongParser = (song: { music: { measures: any } }) => string[];

const parseSong: {
  [key: string]: (config: any) => SongParser;
} = {
  chords: ({ relative }) => (song) => {
    const chords = song.music.measures.flat();
    if (relative) {
      return chords.map((chord) => getChord(chord).symbol);
    }
    return chords;
  },
  transitions: ({ relative = true, semitones = false }) => (song) =>
    song.music.measures
      .flat() // flatten measures as we don't care about rhythm
      .map((chord, index, chords) => {
        const [from, to] = [
          chord || '0',
          chords[(index + 1) % chords.length] || '0'
        ].map((c) => getChord(c)); // parse chords
        if (relative) {
          // relative does only care for interval
          let interval = Interval.distance(from.root, to.root);
          if (semitones) {
            // don't care about enharmonic equivalent intervals
            interval = Interval.semitones(interval) + '';
          }
          return `${from.symbol}.${to.symbol}.${interval}`; // format to id string
        }
        return `${from.root}.${from.symbol}.${to.root}.${to.symbol}`;
      })
      .filter((change) => {
        if (change.includes('0')) {
          return false;
        }
        // filter changes where nothing changes..
        const [fromSymbol, toSymbol, interval] = change.split('.');
        return fromSymbol !== toSymbol || interval !== '1P';
      })
};

export function parseSongs(
  songs,
  parsers: { [key: string]: SongParser }
): { [key: string]: any[] } {
  // prepare empty results
  const results: { [key: string]: any[] } = Object.keys(parsers).reduce(
    (res, feature) => ({ ...res, [feature]: [] }),
    {}
  );
  // run parsers over songs
  songs.forEach((song) =>
    Object.keys(parsers).forEach((feature) => {
      results[feature] = results[feature].concat(parsers[feature](song));
    })
  );
  return results;
}

export function parseTransitions(songs, relative = true, semitones = false) {
  return countUnique(
    parseSongs(songs, {
      transitions: parseSong.transitions({ relative, semitones })
    }).transitions
  ).sort((a, b) => b.count - a.count);
}

export function parseChords(songs, relative = true) {
  return countUnique(
    parseSongs(songs, {
      chords: parseSong.chords({ relative })
    }).chords
  ).sort((a, b) => b.count - a.count);
}