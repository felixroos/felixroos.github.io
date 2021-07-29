import { Note } from '@tonaljs/tonal';
import React from 'react';
import { State } from 'react-powerplug';
import canUseDOM from '../canUseDOM';
import Spiral from '../common/Spiral';
import { angle, edo12, frequencyColor, nearestPitch } from './tuning';
import * as Tone from 'tone';
const { PolySynth, Synth } = Tone;

const harp =
  canUseDOM() &&
  new PolySynth({
    maxPolyphony: 6,
    voice: Synth,
    options: {
      volume: -16,
      envelope: { attack: 0.01, decay: 2, sustain: 0, release: 0.1 },
      oscillator: { type: 'fmtriangle' },
    },
  }).toDestination();

const valves: [number, string][] = [
  [0, '000'],
  [-1, '010'],
  [-2, '001'],
  [-3, '011'],
  [-4, '110'],
  [-5, '101'],
  [-6, '111'],
  [-3, '100'],
];
const defaultPitches = [
  [2, -6],
  [2, -5],
  [2, -4],
  [2, -3],
  [2, -2],
  [2, -1],
  [2, 0],
  [3, -6],
  [3, -5],
  [3, -4],
  [3, -3],
  [3, -2],
  [3, -1],
  [3, 0],
  [4, -4],
  [4, -3],
  [4, -2],
  [4, -1],
  [4, 0],
  [5, -3],
  [5, -2],
  [5, -1],
  [5, 0],
  [6, -2],
  [6, -1],
  [6, 0],
  [8, -4],
  [8, -3],
  [8, -2],
  [8, -1],
  [8, 0],
  [10, -3],
  [10, -2],
];
const allPitches = [
  [2, -6],
  [2, -5],
  [2, -4],
  [2, -3],
  [2, -2],
  [2, -1],
  [2, 0],
  [3, -6],
  [3, -5],
  [3, -4],
  [3, -3],
  [3, -2],
  [3, -1],
  [4, -6],
  [3, 0],
  [4, -5],
  [4, -4],
  [4, -3],
  [5, -5],
  [4, -1],
  [4, -2],
  [5, -4],
  [4, 0],
  [5, -3],
  [5, -2],
  [6, -5],
  [5, -1],
  [6, -4],
  [5, 0],
  [6, -3],
  [7, -5],
  [6, -2],
  [6, -1],
  [7, -4],
  [7, -3],
  [6, 0],
  [8, -5],
  [7, -2],
  [8, -4],
  [7, -1],
  [9, -5],
  [8, -3],
  [7, 0],
  [9, -4],
  [8, -2],
  [10, -5],
  [8, -1],
  [9, -3],
  [10, -4],
  [9, -2],
  [8, 0],
  [11, -5],
  [10, -3],
  [9, -1],
  [10, -2],
];

export function TrumpetSpiral() {
  return (
    <State
      initial={{
        zoom: 1.1,
        spin: 0,
        precision: 1,
        min: 0,
        max: 4,
        strokeWidth: 2,
        base: Note.freq('Bb1'),
        fontSize: 12,
        reduce: false,
        temper: false,
        defaultsOnly: false,
        showValves: false,
      }}
    >
      {({ state, setState }) => {
        const generator = 4 / 3;
        const notes = 54;
        const octaveRadius = 60;
        let ratios = [1, 2, 3, 4, 5];
        const pitches = (state.defaultsOnly ? defaultPitches : allPitches).map(([harmonic, offset]) => {
          const valve = edo12(offset);
          const transposed = edo12(offset + 2);
          const angle = harmonic * valve;
          return [
            angle,
            state.showValves
              ? parseInt(valves[Math.abs(offset)][1], 2)
              : nearestPitch(transposed * harmonic * state.base),
            frequencyColor(valve * state.base * 3),
          ];
        });
        const show12EDO = true;
        return (
          <>
            <div
              style={{
                overflow: 'auto',
                maxWidth: 900,
                maxHeight: 700,
                position: 'relative',
              }}
            >
              <Spiral
                width={600}
                height={600}
                stroke="gray"
                {...state}
                getRadius={(angle, maxRadius, zoom) => zoom * angle * octaveRadius}
                lines={[].concat(
                  show12EDO
                    ? Array.from({ length: 12 }, (_, i) => [
                        0,
                        angle(Math.pow(2, i / 12) * Math.pow(2, state.max)),
                        'gray',
                      ])
                    : []
                )}
                labels={pitches.map(([ratio, label, color], i) => ({
                  label,
                  angle: angle(ratio * 2),
                  fill: color || frequencyColor(ratio * state.base),
                  color: 'black',
                }))}
                onTrigger={(i) => harp.triggerAttackRelease(pitches[i][0] * state.base, 1)}
              />
            </div>
            <label>
              <input
                type="checkbox"
                checked={state.defaultsOnly}
                onChange={(e) => setState({ defaultsOnly: e.target.checked })}
              />
              Defaults Only
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={state.showValves}
                onChange={(e) => setState({ showValves: e.target.checked })}
              />
              Show Combinations
            </label>
          </>
        );
      }}
    </State>
  );
}
