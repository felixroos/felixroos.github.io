import { scaleLinear } from 'd3-scale';
import React from 'react';
import { frequencyColor } from './tuning';

export default function PitchSpectrum({ frequencies, min, max }) {
  const width = 500;
  const height = 50;
  const strokeWidth = 5;
  const x = scaleLinear()
    .domain([min, max])
    .range([strokeWidth / 2, width - strokeWidth / 2]);
  return (
    <svg width={width} height={height}>
      {frequencies.map((f, index) => (
        <line
          key={index}
          stroke={frequencyColor(f)}
          strokeWidth={strokeWidth}
          x1={x(f)}
          x2={x(f)}
          y1={0}
          y2={height}
        ></line>
      ))}
    </svg>
  );
}
