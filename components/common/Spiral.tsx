import React from 'react';
import { easeCubicIn } from 'd3-ease';

export type Line = [number, number, string];
export type Label = {
  label: string;
  angle: number;
  fill: string;
  color: string;
};

export interface SpiralProps {
  zoom?: number;
  width?: number;
  height?: number;
  spin?: number;
  min?: number;
  max?: number;
  stroke?: string;
  precision?: number;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square' | 'inherit';
  getRadius?: (angle?: number, maxRadius?: number, zoom?: number) => number;
  lines?: Line[];
  labels?: Label[];
  fontSize?: number;
  onTrigger?: (index: number) => void;
  hideLabels?: boolean; // TBD: implement in spiral
  hideLines?: boolean; // TBD: implement in spiral
  compression?: number; //
}

export default function Spiral({
  zoom,
  width,
  height,
  spin,
  min,
  max,
  stroke,
  precision,
  strokeWidth,
  strokeLinecap,
  getRadius,
  lines,
  labels,
  fontSize,
  onTrigger,
  compression
}: SpiralProps) {
  zoom = zoom || 1;
  spin = spin || 0;
  compression = compression || 1;
  fontSize = fontSize || 10;
  min = min || 0;
  precision = Math.abs(precision || 1);
  strokeWidth = strokeWidth || 1;
  width = width || 600;
  height = height || 400;
  const center = [width / 2, height / 2];
  let maxRadius = Math.sqrt(width * width + height * height) / 2; // max distance from center (to edge)
  let dots = [];
  const compress = (angle) => (compression + angle - 1) / compression;
  const rad = (angle) =>
    getRadius ? getRadius(angle, maxRadius, zoom) : angle * zoom * maxRadius;
  const maxPositions = 20000; // hard limit to prevent infinite loops of imploding spirals
  let currentRadius = min * zoom * maxRadius;
  while (
    currentRadius < maxPositions &&
    (!dots.length ||
      (Math.abs(dots[0][1]) <= maxRadius && // stop if next radius would be out of view anyway
        (max === undefined || dots[0][0] <= max))) // if if max rotations are reached (if max is set)
  ) {
    const angle = currentRadius / zoom / maxRadius;
    dots.unshift([angle, rad(angle)]);
    currentRadius += 1 / precision;
  }
  if (max) {
    const lastAngle = Math.min(dots[0][0], max);
    dots[0][0] = lastAngle;
    dots[0][1] = rad(lastAngle);
  }
  dots = dots.map(([angle, radius]) => {
    return spiralPosition(angle, radius, spin, ...center);
  });
  const lineProps: [[number, number], [number, number], string][] = (
    lines || []
  ).map(([a, b, color]) => {
    return [
      spiralPosition(a, rad(a), spin, ...center),
      spiralPosition(b, rad(b), spin, ...center),
      color
    ];
  });
  return (
    <>
      <svg width={width} height={height}>
        <path
          d={`M${dots.join('L')}`}
          stroke={stroke || 'gray'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap || 'round'}
        />
        {lineProps.map(([from, to, color], i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={color || stroke || 'gray'}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap || 'round'}
          />
        ))}
        {(labels || []).map(({ angle, label, color, fill }, i) => {
          const [x, y] = spiralPosition(angle, rad(angle), spin, ...center);
          return (
            <g
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={() => onTrigger && onTrigger(i)}
            >
              <circle
                cx={x}
                cy={y}
                r={fontSize}
                fill={fill || stroke || 'gray'}
              />
              <text
                x={x}
                y={y + fontSize / 3}
                textAnchor="middle"
                fill={color || 'white'}
                style={{
                  fontSize,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
}

export function spiralPosition(
  angle,
  radius,
  spin = 0,
  cx = radius,
  cy = radius
): [number, number] {
  return [
    Math.sin((spin - angle + 0.5) * Math.PI * 2) * radius + cx,
    Math.cos((spin - angle + 0.5) * Math.PI * 2) * radius + cy
  ];
}

export function animateSpiral(props, progress, easing = (t) => t) {
  // TBD use d3-interpolate
  let { zoom, spin, compression, linearity, hideLines } = props;
  linearity = easing(1 - progress);
  if (linearity) {
    // hideLines = true;
    zoom *= Math.pow(10000, linearity);
    spin -= Math.pow(0.25, linearity);
    compression *= Math.pow(20000, linearity);
  }
  return { zoom, spin, compression };
}

// renders spiral points with format [angle, radius] inside width/height
export function renderSpiral(props: {
  width?: number;
  height?: number;
  maxRotations?: number;
  maxAngle?: number;
  maxRadius?: number;
  getRadius?: (angle: number) => number;
  radius?: number;
  angleDelta?: number; // the angle of rotation between each point on the line
}) {
  let {
    width,
    height,
    maxRotations,
    getRadius,
    radius,
    maxRadius,
    maxAngle,
    angleDelta
  } = props;
  const TAU = Math.PI * 2;
  radius = radius || 100;
  // TBD: strategies: fill, contain
  maxRadius =
    maxRadius !== undefined
      ? maxRadius
      : Math.sqrt(width * width + height * height) / 2;
  if (maxRotations) {
    maxAngle = maxRotations * TAU;
  }
  angleDelta = angleDelta !== undefined ? angleDelta : TAU / 128;
  let i = 0;
  let angle = 0;
  getRadius = getRadius || ((angle) => (angle / TAU) * radius);
  const clipAngle = (point) =>
    maxAngle !== undefined && Math.abs(point[0]) > maxAngle;
  const clipRadius = (point) =>
    maxRadius !== undefined && Math.abs(point[1]) > maxRadius;
  const spiral: [number, number][] = [[0, getRadius(0)]];
  while (!clipAngle(spiral[0]) && !clipRadius(spiral[0])) {
    angle = angleDelta * i;
    spiral.unshift([angle, getRadius(angle)]);
    ++i;
  }
  return spiral;
}

/*
// example:
  const spiral = renderSpiral({
    width,
    height,
    angleDelta: -(2 * Math.PI) / 20,
    // maxRadius: 128,
    // getRadius: (angle) => Math.pow(2, angle / (2 * Math.PI) + 4),
    getRadius: (angle) => (angle / (2 * Math.PI) - 3) * 20,
    maxAngle: 2 * Math.PI * 3
    // radius: 25
  });
*/
