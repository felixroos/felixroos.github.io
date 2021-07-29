import React from 'react';
import { scaleLinear, scaleLog } from 'd3-scale';
import { max, min } from 'd3-array';
import { interpolateRound } from 'd3-interpolate';
import { Note } from '@tonaljs/tonal';
import { nearestPitch, frequencyColor } from './tuning';

import canUseDOM from '../canUseDOM';
import * as Tone from 'tone';
const { PolySynth, Synth } = Tone;
const harp = canUseDOM() && new PolySynth({ maxPolyphony: 6, voice: Synth, options: { volume: -6 } }).toDestination();

export default function Strings({ frequencies, notes, labels, amplitudes }: any) {
  frequencies = frequencies || [];
  if (notes) {
    frequencies = frequencies.concat(notes.map((note) => Note.freq(note)));
  }
  const options = {
    size: {
      width: 600,
      height: 400,
    },
    margin: {
      top: 0,
      bottom: 40,
      left: 20,
      right: 20,
    },
    strokeWidth: 8,
  };
  const { size, margin, strokeWidth } = options;
  const innerWidth = size.width - margin.left - margin.right;
  const innerHeight = size.height - margin.top - margin.bottom;

  const x = scaleLog()
    .base(2)
    .domain([min(frequencies), max(frequencies)])
    .range([margin.left, size.width - margin.right - strokeWidth])
    .interpolate(interpolateRound);

  const lineLength = scaleLinear() /*  scaleLog()
    .base(2) */
    .domain([1, max(frequencies)])
    .range([1, innerHeight])
    .interpolate(interpolateRound);

  function handleTrigger(i) {
    harp.triggerAttackRelease(frequencies[i], '4n', '+0', amplitudes ? Math.abs(amplitudes[i]) || 1 : 1);
  }
  return (
    <>
      <svg {...size} style={{ maxWidth: size.width }}>
        {/* <rect x={0} y={0} {...size} stroke="gray" fill="white" />  */}
        {/* <rect
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          stroke="black"
          fill="white"
        /> */}

        {frequencies.map((f, i) => {
          const length = !amplitudes ? lineLength(f) : amplitudes[i] * innerHeight;
          const pos = { x: x(f), y: margin.top + (innerHeight - length) };
          const radius = margin.bottom / 2;
          const text = {
            x: pos.x + strokeWidth / 2,
            y: size.height - margin.bottom + radius,
          };
          const label = labels ? labels[i] : nearestPitch(f);
          const color = frequencyColor(f);
          return (
            <g key={i} onMouseEnter={() => handleTrigger(i)}>
              <rect key={`string-${i}`} fill={color} x={pos.x} y={pos.y} width={strokeWidth} height={length}></rect>
              {/* <line
                key={`line-${i}`}
                x1={pos.x}
                y1={pos.y}
                x2={innerWidth + margin.left}
                y2={pos.y}
                fill="black"
                stroke="gray"
                strokeWidth={1}
              /> */}
              <circle cx={text.x} cy={text.y} r={radius} stroke="black" strokeWidth="1" fill={color} />
              {label && (
                <text textAnchor="middle" x={text.x} y={text.y + 5} fill="black">
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <br />
      {/* TBD: scale detect
      <p>
        {frequencies
          .sort()
          .map((f) => nearestPitch(f))
          .join(" ")}
      </p> */}
    </>
  );
}

export function fraction(frequency, root = 440) {
  return Math.log(frequency / root) / Math.log(2);
}
