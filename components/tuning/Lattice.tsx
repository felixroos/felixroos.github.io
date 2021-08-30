import Fraction from 'fraction.js';
import React, { useMemo } from 'react';
import { fractionPrimeVector, slicePrimeVector } from '../common/prime';
import FractionCircle from '../common/FractionCircle';
import { extent } from 'd3-array';
import useSynth from '../common/useSynth';

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

export interface LatticeProps {
  ratios: number[];
  minPrime?: number;
  maxPrime?: number;
  width?: number;
  circleRadius?: number;
  flipX?: boolean;
  flipY?: boolean;
  dimensionUnits?: number[][];
}
export default function Lattice(props: LatticeProps) {
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
  const { ratios, maxPrime, minPrime, flipX, flipY, dimensionUnits } = props;
  let { width, circleRadius } = props;
  circleRadius = circleRadius || 5;
  const padding = circleRadius + 4;
  const fractions = useMemo(() => ratios.map((r) => new Fraction(r) /* .simplify() */), [ratios]);
  const paths = fractions
    .map((f) => ratioPath(f.n, f.d, [minPrime || 3, maxPrime || 7], dimensionUnits || dimensionUnitsGrady))
    .map((path) => path.map(([x, y]) => [x * (flipX ? -1 : 1), y * (flipY ? -1 : 1)]));
  const [minX, maxX] = extent(paths.map((path) => path.map(([x]) => x)).flat());
  const [minY, maxY] = extent(paths.map((path) => path.map(([_, y]) => y)).flat());
  const totalWidth = maxX - minX + padding * 2;
  const totalHeight = maxY - minY + padding * 2;
  const ratio = totalWidth / totalHeight;
  width = width || 300;
  return (
    <svg
      viewBox={`${minX - padding} ${minY - padding} ${totalWidth + padding} ${totalHeight}`}
      width={width}
      height={width / ratio}
    >
      {/* axis */}
      {/* <line x1="0" y1="-100" x2="0" y2="100" stroke="black" strokeWidth="2" />
      <line x1="-100" y1="0" x2="100" y2="0" stroke="black" strokeWidth="2" /> */}
      {/* test*/}
      {paths.map((path, i) => (
        <path key={i} d={`M${path.join('L')}`} stroke="black" strokeWidth="1" fill="transparent" />
      ))}
      {paths.map((path, i) => (
        <FractionCircle
          key={i}
          radius={circleRadius}
          cx={path[path.length - 1][0]}
          cy={path[path.length - 1][1]}
          top={fractions[i].n}
          bottom={fractions[i].d}
          onTrigger={(n) => {
            triggerAttackRelease([n], 1);
            // triggerAttackRelease
          }}
        />
      ))}
      {/*ratioPath(fractions[0].n, fractions[0].d).map(([x,y])=><line x1="0" y1="0" x2="0" y2="-40" stroke="steelblue" strokeWidth="2" />)*/}
    </svg>
  );
}
