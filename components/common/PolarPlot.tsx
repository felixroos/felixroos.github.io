// TODO:
// add zoom https://observablehq.com/@d3/zoomable-scatterplot
import React from 'react';
import { range as d3Range } from 'd3-array';
import { lineRadial } from 'd3-shape';
import { renderSpiral } from './Spiral';

declare type Vec2 = [number, number];
declare type Path2 = Vec2[];

export default function PolarPlot({
  strokeWidth,
  functions,
  width,
  height,
  colors,
  onClick,
  margin,
  maxAngle,
  radius
}: any) {
  margin = margin || { top: 20, right: 30, bottom: 30, left: 50 };
  width = width || 500;
  height = height || 500;
  radius = radius || 1;
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  strokeWidth = strokeWidth || 1;
  colors = colors || [
    'lightsalmon',
    'lightseagreen',
    'indianred',
    'darkmagenta',
    'cornflowerblue',
    'aqua'
  ];
  functions = functions || [(x) => Math.sin(2 * x)];

  const maxRadius = Math.min(width / 2, height / 2); // from center to edge
  const angleRange = [0, maxAngle || 2 * Math.PI];

  const lines: [number, number][][] = functions.map((f) =>
    d3Range(angleRange[0], angleRange[1], 0.01).map((t) => [
      t - Math.PI / 2, // rotate by 90deg to be standard
      (f(t) * maxRadius) / radius
    ])
  );

  return (
    <svg width={width} height={height} onClick={(e) => onClick && onClick(e)}>
      <circle
        cx={width / 2}
        cy={height / 2}
        stroke="gray"
        r={maxRadius}
        fill="none"
      />
      {lines.map((line, i) => (
        <path
          d={lineRadial()(line)}
          key={i}
          fill="none"
          stroke="gray"
          transform={`translate(${width / 2},${height / 2})`}
        />
      ))}
    </svg>
  );
}
