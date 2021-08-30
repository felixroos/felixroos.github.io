import Fraction from 'fraction.js';
import React, { useMemo } from 'react';
import SVG, { offset3d, project3d, rotate3d, scale3d } from '../3d/SVG';
import { Permutation } from '../combinatorial-search/Permutation';
import AnimationFrame from '../common/AnimationFrame';
import FractionCircle from '../common/FractionCircle';
import { fractionPrimeVector, primefactors, slicePrimeVector, withoutFactor } from '../common/prime';
import { curry, both, allPass, pipe, and, ifElse } from 'ramda';
import useSynth from '../common/useSynth';

export default function Lattice3d(props) {
  const { ratios, angles = [0, 0, 0], scale = 200, offset = [0, 0, 0], maxDistance = 14, flipX, flipY, flipZ } = props;
  const { triggerAttackRelease } = useSynth({
    voices: 4,
    options: {
      volume: -16,
      oscillator: { type: 'fmtriangle' },
      envelope: {
        attack: 0.001,
        decay: 2,
        sustain: 0,
        release: 0.1,
      },
    },
  });
  const combinations = useMemo(
    () =>
      ratioConnections(ratios, (from, to) => {
        if (from > to) {
          return false;
        }
        const [a, b] = [new Fraction(from), new Fraction(to)];
        let { n, d } = a.div(b);
        [n, d] = [n, d].map((v) => withoutFactor(2, v));
        return n * d <= maxDistance;
      }),
    [ratios]
  );
  const { points, lines, fractions, zIndices } = useMemo(() => {
    const fractions = ratios.map((r) => new Fraction(r));
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
  }, [ratios, angles, scale, offset]);
  return (
    <SVG viewBox="-200 -200 400 400" width="600">
      {lines.map(([[x1, y1], [x2, y2]], i) => (
        <line key={i} {...{ x1, y1, x2, y2 }} stroke="black" strokeWidth="1" />
      ))}
      {zIndices.map((i) => (
        <FractionCircle
          key={i}
          radius={0.125 * scale}
          cx={points[i][0]}
          cy={points[i][1]}
          top={fractions[i].n}
          bottom={fractions[i].d}
          onTrigger={(n) => {
            triggerAttackRelease([n], 1);
            // triggerAttackRelease
          }}
        />
      ))}
    </SVG>
  );
}

export function ratioPoint3d(n, d, flipAxis = [false, false, false]) {
  let vector = fractionPrimeVector(n, d);
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

export function AnimatedLattice(props) {
  return (
    <AnimationFrame autostart={true}>
      {({ time }) => {
        const angle = time.fromStart / 50;
        return <Lattice3d width={300} {...props} angles={props.rotator?.(angle) || [angle, angle / 2, angle / 3]} />;
      }}
    </AnimationFrame>
  );
}

// finds connections with validator that runs on each new connection
export function connections(items: (string | number)[], validator, number = 2) {
  const isUnique = curry((collected, ball) => !collected.includes(ball));
  const isValid = curry((collected, ball) => !collected.length || validator(collected[collected.length - 1], ball));
  const isFull = (collected) => collected.length === number;
  const getNext = (collected) => items.filter(allPass([isUnique(collected), isValid(collected)]));
  const isNewSolution = (collected, solutions) =>
    !solutions.find((solution) => Permutation.isEqual(collected, solution));

  return Permutation.search(
    (collected) => (isFull(collected) ? [] : getNext(collected)),
    (collected, solutions) => isFull(collected) && isNewSolution(collected, solutions)
  );
}

export function ratioConnections(ratios, validate) {
  const indices = ratios.map((_, i) => i);
  return connections(indices, (a, b) => validate(ratios[a], ratios[b]));
}
