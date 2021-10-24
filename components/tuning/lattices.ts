import { Interval } from '@tonaljs/tonal';
import Fraction from 'fraction.js';
import { pipe } from 'ramda';
import { offset3d, project3d, rotate3d, scale3d } from '../3d/SVG';
import { Permutation } from '../combinatorial-search/Permutation';
import { fractionPrimeVector, primefactors, primes, slicePrimeVector, withoutFactor } from '../common/prime';
import { cents, tenneyHeight } from './tuning';

//2D

// taken from http://www.anaphoria.com/wilsontreasure.html
export const dimensionUnitsWilson = [
  [40, 0], // 3
  [0, 40], // 5
  [8, 6], // 7
  [-6, 8], // 11
  [-2, 4], // 13
];
export const dimensionUnitsGrady = [
  [40, 0], // 3
  [0, 40], // 5
  [13, 11], // 7
  [-14, 18], // 11
  [-8, 4], // 13
];
export const dimensionUnitsTonnetz = [
  [40, 0], // 3
  [20, 40], // 5
];

export function ratioPath(n, d, primeRange = [3], dimensionUnits = dimensionUnitsGrady) {
  let vector = fractionPrimeVector(n, d);
  vector = slicePrimeVector(vector, ...primeRange);
  const points = [[0, 0]];
  vector.forEach((value, i) => {
    const [deltaX, deltaY] = dimensionUnits[i];
    const [x, y] = points[0];
    points.unshift([x + deltaX * value, y + deltaY * value]);
  });
  return points.reverse();
}

// 3D

declare type LatticeProps = {
  ratios: number[];
  angles: number[];
  scale: number;
  offset: number[];
  maxDistance: number;
  flipX: boolean;
  flipY: boolean;
  flipZ: boolean;
};
export function ratioPoint3d(n, d, flipAxis = [false, false, false]): number[] {
  let vector = fractionPrimeVector(n, d); // monzo
  vector = slicePrimeVector(vector, 3, 7);
  if (vector.length < 3) {
    vector = vector.concat(Array(3 - vector.length).fill(0));
  }
  let [x, y, z] = vector;
  return [x, -y, z].map((v, i) => (flipAxis[i] ? -v : v));
}

export function ratioPath3d(n, d) {
  let vector = fractionPrimeVector(n, d);
  vector = slicePrimeVector(vector, 3, 7);
  const points = [[0, 0, 0]];
  return points.reverse();
}

export function latticeConnections(fractions, maxTenneyHeight = 5) {
  const indices = fractions.map((_, i) => i);
  return Permutation.connections<number>(indices, ([ia, ib]) => {
    const [a, b] = [fractions[ia], fractions[ib]];
    if (ia > ib) {
      return false;
    }
    let { n, d } = a.div(b);
    [n, d] = [n, d].map((v) => withoutFactor(2, v));
    return tenneyHeight(n, d) <= maxTenneyHeight;
  });
}

export function lattice(props: LatticeProps): any {
  const { ratios, angles = [0, 0, 0], scale = 200, offset = [0, 0, 0], maxDistance = 5, flipX, flipY, flipZ } = props;
  const fractions = ratios.map((r) => new Fraction(r));
  const combinations = latticeConnections(fractions, maxDistance);
  const points3d = fractions
    .map(({ n, d }) => ratioPoint3d(n, d, [flipX, flipY, flipZ]))
    .map(pipe(offset3d(offset), scale3d(scale), rotate3d(angles)));
  const zIndices = points3d
    .map((p, i) => [p, i])
    .sort(([a], [b]) => a[2] - b[2])
    .map(([_, i]) => i);
  const points = points3d.map(project3d);
  const lines = combinations.map(([a, b]: number[]) => [points[a], points[b]]);
  return { points, lines, fractions, points3d, zIndices };
}

