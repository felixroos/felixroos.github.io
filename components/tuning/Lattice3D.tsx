import React, { useMemo } from 'react';
import SVG from '../3d/SVG';
import AnimationFrame from '../common/AnimationFrame';
import FractionCircle from '../common/FractionCircle';
import useSynth from '../common/useSynth';
import { lattice } from './lattices';

export default function Lattice3D(props) {
  const { scale = 200, unit = 'note' } = props;
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
  const { points, lines, fractions, zIndices } = useMemo(() => lattice(props), [props]);
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
          unit={unit}
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
