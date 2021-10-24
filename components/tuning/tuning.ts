import { TinyColor } from '@ctrl/tinycolor';
import { Interval, Note, Range } from '@tonaljs/tonal';
import { interpolateRainbow } from 'd3-scale-chromatic';
import Fraction from 'fraction.js';
import { Permutation } from '../combinatorial-search/Permutation';
import { primefactors, primes } from '../common/prime';
// import * as Combinatorics from 'js-combinatorics';

// takes a generator and position + number of pitches inside an equivalence
// example pythagorean tuning: generate(3, 7, 12, 2)
// 3 is the number that is powered (generator)
// 7 is the end position of the generator sorted scale (pos)
// 12 is the number of pitches (n)
// 2 is the equivalence factor (all ratios will be "powered into it")
export function generate(generator, pos, n, equivalence = 2) {
  const ratios = [];
  for (let i = pos - n; i < pos; ++i) {
    const unreduced = Math.pow(generator, i);
    // exponent to reduce below equivalence (e.g. 2^x for octave reduction)
    const reducer = Math.ceil(Math.log(1 / unreduced) / Math.log(equivalence));
    const reduced = unreduced * Math.pow(equivalence, reducer);
    ratios.push({
      ratio: reduced,
      power: i,
    });
  }
  return ratios.sort((a, b) => a.ratio - b.ratio).map((r, i) => ({ ...r, position: i }));
}

export function partials([min, max], base = 440) {
  const f = [];
  for (let i = min; i <= max; ++i) {
    if ([0, -1].indexOf(i) === -1) {
      f.push(base * (i < 0 ? -(1 / i) : i));
    }
  }
  return f.filter((f, i, a) => a.indexOf(f) === i);
}

export function powerN(n, power) {
  const factor = Math.pow(n, power);
  const exp = Math.ceil(Math.log(1 / factor) / Math.log(2));
  const value = Math.pow(2, exp) * factor;
  const [top, bottom] = new Fraction(value).toFraction().split('/');
  return { factor, exp, value, top, bottom };
}

export function pythagoreanComma(power) {
  return (1 - 524288 / 531441) * (power / 12);
}

// generates all possible powers for array of [base, min, max]
// example: [[3,0,2], [5,0,1]] yields [[1, 3, 9], [1, 5]]
export function powers(numbers: [number, number, number][], mapFn?: (power: [number, number]) => number) {
  const powers = numbers.reduce((_powers, n) => {
    const values = [];
    for (let p = n[1]; p <= n[2]; ++p) {
      if (typeof mapFn === 'function') {
        values.push(mapFn([n[0], p]));
      } else {
        values.push(Math.pow(n[0], p));
      }
    }
    _powers.push(values);
    return _powers;
  }, []);
  return powers;
}

export function limit5([fifths, rotateFifths], [thirds, rotateThirds]) {
  return Array.from({ length: fifths + 1 }, (_, f) =>
    Array.from({ length: thirds + 1 }, (_, t) => {
      const fifth = f + rotateFifths;
      const third = t + rotateThirds;
      const factor = Math.pow(3, fifth) * Math.pow(5, third);
      const exp = Math.ceil(Math.log(1 / factor) / Math.log(2));
      const ratio = Math.pow(2, exp) * factor;
      const [top, bottom] = new Fraction(ratio).toFraction().split('/');
      return {
        fifth,
        third,
        factor,
        exp,
        ratio,
        top,
        bottom: bottom || 1,
      };
    })
  );
}

// generates all possible ratios for given bases
// example: limitN([[3, 0, 2], [5, 0, 1]]) yields [1, 3, 9, 5, 15, 45]
// if equivalence factor is passed, then it reduces by that factor:
// example: limitN([[3, 0, 2], [5, 0, 1]],2) yields [1, 3/2, 9/8, 5/4, 15/8, 45/32]
/* export function limitN(numbers: [number, number, number][], equivalenceFactor?: number, mapFn?: (power: [number, number]) => number) {
  // TODO:
  const primePowers = powers(numbers, mapFn);
  return Combinatorics.cartesianProduct(...primePowers).toArray()
    .map(powers => powers.reduce((value, power) => value * power, 1))
    .map(v => equivalenceFactor ? equivalence(v, equivalenceFactor) : v)
} */

// reduces ratio to given equivalence factor
// example: equivalence(1/3, 2) yields 4/3
// TBD: think about if its possible to have multiple values for the same ratio, if yes => fails for those
export function equivalence(r, equivalenceFactor = 2) {
  const exp = Math.ceil(Math.log(1 / r) / Math.log(equivalenceFactor));
  return Math.pow(2, exp) * r;
}

export function angle(ratio: number, equivalence = 2) {
  return Math.log(ratio) / Math.log(equivalence);
}

export function cents(ratio: number) {
  return (Math.log(ratio) / Math.log(2)) * 1200;
}

export function frequencyColor(frequency: number) {
  const fraction = cents(frequency / 440) / 1200;
  return new TinyColor(interpolateRainbow(fraction % 1)).lighten(20).toHexString();
}

// stacks n partials by a fixed interval (factor) ontop of each other
export function stack(n, factor = 3 / 2, base = 440) {
  const f = [base];
  for (let i = 1; i < n; ++i) {
    f.push(f[f.length - 1] * factor);
  }
  return f;
}

export function ratios(start = 1, factors = [2 / 3, 4 / 3], n = factors.length) {
  const ratios = [start];
  for (let i = 0; i < n; ++i) {
    ratios.push(ratios[ratios.length - 1] * factors[i % factors.length]);
  }
  return ratios;
}

export const edo12 = (semitones, octaveOffset = 0) => Math.pow(2, semitones / 12 + octaveOffset);

// divides a frequency by 2 until it is inside one octave above the base
export function clamp(frequency, base = 440) {
  if (frequency > base * 2) {
    return clamp(frequency / 2, base);
  }
  if (frequency < base) {
    return clamp(frequency * 2, base);
  }
  return frequency;
}

export function nearestPitch(frequency) {
  // const delta = (f1, f2) => Math.abs(f1 - f2)
  return Range.chromatic(['C0', 'C8'])
    .map((note) => ({ note, freq: Note.freq(note) }))
    .reduce(
      (best: any, note: any) => {
        const delta = Math.abs(frequency - note.freq);
        return !best || delta < best.delta ? { ...note, delta } : best;
      },
      { note: 'no_match', freq: 0, delta: Infinity }
    ).note;
}

export function nearestInterval(/* ratio */) {
  // TBD return nearest ET12 interval
}

export function maxFractionSize(floats) {
  return floats.reduce(
    ([maxCols, maxRows], float) => {
      const fraction = new Fraction(float).toFraction().split('/');
      return [Math.max(parseInt(fraction[0]), maxCols), Math.max(fraction[1] ? parseInt(fraction[1]) : 1, maxRows)];
    },
    [0, 0]
  );
}

export function multisets(factors, maxTenneyHeight) {
  const getProduct = (collected) => Math.abs(collected.reduce((p, n) => p * n, 1));
  const exceedsHeight = (collected) => !maxTenneyHeight || Math.log2(getProduct(collected)) > maxTenneyHeight;
  // const getNext = collected => factors.filter(pipe(collected.includes, not))
  const getNext = (collected) => factors.filter((f) => getProduct(collected.concat([f])) <= maxTenneyHeight);
  const isNewSolution = (collected, solutions) =>
    !solutions.find((solution) => Permutation.isEqual(collected, solution));
  const combinations = Permutation.search(
    (collected) => (exceedsHeight(collected) ? [] : getNext(collected)),
    (collected, solutions) => collected.length && !exceedsHeight(collected) && isNewSolution(collected, solutions)
  );
  return combinations;
}

export function productSet(factors: number[], maxTenneyHeight: number, product = 1, solutions: number[] = []) {
  if (product <= maxTenneyHeight && !solutions.includes(product)) {
    solutions.push(product);
  }
  const candidates = product > maxTenneyHeight ? [] : factors.filter((f) => product * f <= maxTenneyHeight);
  if (!candidates.length) {
    return solutions;
  }
  return candidates.reduce(
    (_, candidate: number) => productSet(factors, maxTenneyHeight, product * candidate, solutions),
    []
  );
}

export function lattice(limit, maxTenneyHeight, reduce = false) {
  const factors = [...primes(3, limit), ...primes(3, limit).map((p) => -p)];
  const sets = multisets(factors, maxTenneyHeight);
  const products = sets.map((set) => set.reduce((p: number, n: number) => (n > 0 ? p * n : p / -n), 1));
  if (reduce) {
    return products.map((r) => clamp(r, 1));
  }
  return products;
}

export function tenneyHeight(n: number, d: number) {
  return Math.log2(n * d);
}

export function ratioInterval(ratio) {
  const { n, d } = new Fraction(ratio);
  const [nFactors, dFactors] = [primefactors(n), primefactors(d)];
  const primeIntervals = ['8P', '12P', '17M', '21m', '25A', '27m'];
  // 12P = 3
  // 17M = 5
  // 20M = 6
  // 26m = 7
  const prms = primes(2, 13);
  let interval = nFactors.reduce(
    (interval, factor) => Interval.add(interval, primeIntervals[prms.indexOf(factor)]),
    '1P'
  );
  return dFactors.reduce(
    (interval, factor) => Interval.substract(interval, primeIntervals[prms.indexOf(factor)]),
    interval
  );
}

export function ratioSemitones(ratio) {
  return Math.round((cents(ratio) % 1200) / 100);
}

export function getRatioLabel(ratio, unit = 'ratio', root = 'C4') {
  const { n, d } = new Fraction(ratio);
  switch (unit) {
    case 'ratio':
      return `${n}/${d}`;
    case 'note':
      return Note.transpose(root, ratioInterval(ratio));
    case 'cent':
      return Math.round(cents(ratio)) + '';
    case 'frequency':
      return Math.round(Note.freq(root) * ratio);
  }
}
