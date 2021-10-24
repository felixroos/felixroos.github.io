import { Button, ButtonGroup } from '@material-ui/core';
import { Note } from '@tonaljs/tonal';
import { extent } from 'd3-array';
import Fraction from 'fraction.js';
import React, { useMemo } from 'react';
import ConnectedCircle from '../common/ConnectedCircle';
import FractionCircle from '../common/FractionCircle';
// import SimplePopover from '../common/Popover';
import usePropState from '../common/usePropState';
import useSynth from '../common/useSynth';
import { dimensionUnitsGrady, ratioPath } from './lattices';
import RatioCircle from './RatioCircle';
import { cents, frequencyColor, ratioInterval } from './tuning';

const units = {
  ratio: 'Ratio',
  note: 'Note',
  cent: 'Cent',
  frequency: 'Hertz',
};
const views = {
  lattice: 'Lattice',
  circle: 'Circle',
};

export interface LatticeProps {
  ratios: number[];
  unit?: string;
  view?: string;
  minPrime?: number;
  maxPrime?: number;
  width?: number;
  circleRadius?: number;
  flipX?: boolean;
  flipY?: boolean;
  dimensionUnits?: number[][];
  showSettings?: boolean;
}
export default function Lattice2D(props: LatticeProps) {
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
  const {
    ratios,
    maxPrime,
    minPrime,
    flipX, //: flipXProp,
    flipY, //: flipYProp,
    dimensionUnits,
    unit: unitProp,
    view: viewProp,
    showSettings,
  } = props;
  // const [flipX, setFlipX] = usePropState(flipXProp || false);
  // const [flipY, setFlipY] = usePropState(flipYProp || false);
  const [activeUnit, setActiveUnit] = usePropState(unitProp || 'ratio');
  const [activeView, setActiveView] = usePropState(viewProp || 'lattice');
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
  const root = 'C4';
  const base = Note.freq(root);
  width = width || 300;
  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      {showSettings && (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <ButtonGroup color="primary">
            {Object.keys(units).map((unit) => (
              <Button
                key={unit}
                variant={activeUnit === unit ? 'contained' : 'outlined'}
                onClick={() => setActiveUnit(unit)}
              >
                {units[unit]}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup color="primary">
            {Object.keys(views).map((view) => (
              <Button
                key={view}
                variant={activeView === view ? 'contained' : 'outlined'}
                onClick={() => setActiveView(view)}
              >
                {views[view]}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
      {activeView === 'lattice' && (
        <svg
          viewBox={`${minX - padding} ${minY - padding} ${totalWidth + padding} ${totalHeight}`}
          width={width}
          height={width / ratio}
        >
          {/* axis */}
          {/* <line x1="0" y1="-100" x2="0" y2="100" stroke="black" strokeWidth="2" />
      <line x1="-100" y1="0" x2="100" y2="0" stroke="black" strokeWidth="2" /> */}
          {paths.map((path, i) => (
            <path key={i} d={`M${path.join('L')}`} stroke="black" strokeWidth="1" fill="transparent" />
          ))}
          {paths.map((path, i) => (
            <FractionCircle
              key={i}
              base={base}
              unit={activeUnit}
              radius={circleRadius}
              cx={path[path.length - 1][0]}
              cy={path[path.length - 1][1]}
              top={fractions[i].n}
              bottom={fractions[i].d}
              onTrigger={(n) => triggerAttackRelease([n], 1)}
            />
          ))}
        </svg>
      )}
      {activeView === 'circle' && (
        <RatioCircle ratios={ratios} unit={activeUnit} onTrigger={(n) => triggerAttackRelease([n], 1)} />
      )}
    </div>
  );
}
