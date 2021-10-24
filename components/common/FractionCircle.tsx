import { Note } from '@tonaljs/tonal';
import React from 'react';
import { useMemo } from 'react';
import { cents, frequencyColor, getRatioLabel, ratioInterval } from '../tuning/tuning';

declare type FractionCircleProps = {
  radius: number;
  border?: number;
  cx?: number;
  cy?: number;
  invert?: boolean;
  top: number;
  bottom: number;
  onClick?: (value: number) => any;
  playOnHover?: boolean;
  base?: number;
  strokeWidth?: number;
  fill?: string;
  onHover?: (value: number) => any;
  playWithTonic?: boolean;
  onTrigger?: (frequencies: number[]) => any;
  unit?: string;
  padding?: number;
  value?: number;
};

export default function FractionCircle(props: FractionCircleProps) {
  const { top, bottom } = props;
  const value = useMemo(() => top / bottom, [top, bottom]);
  const {
    base = 440,
    border = 1,
    radius = 30,
    strokeWidth = (radius / 16) * border,
    cx = 100,
    cy = 100,
    invert,
    onClick = play,
    playOnHover,
    onHover = playOnHover ? play : () => {},
    playWithTonic,
    onTrigger,
    unit = 'ratio',
    padding = 0.4,
    fill = !top || !bottom ? 'white' : frequencyColor((invert ? 1 / value : value) * base),
  } = props;

  const label = useMemo(() => getRatioLabel(value, unit, Note.fromFreq(base)), [value, unit, base]);

  function play(f) {
    if (!top || !bottom) {
      return;
    }
    let frequencies = [f];
    if (f !== base && playWithTonic) {
      frequencies.push(base);
    }
    if (onTrigger) {
      onTrigger(frequencies);
    } else {
      console.warn('onTrigger not set..');
    }
  }
  const x = cx + strokeWidth;
  const y = cy + strokeWidth;
  const r = radius - strokeWidth / 2;
  const text = {
    fontSize: radius * 0.6,
    textAnchor: 'middle',
    pointerEvents: 'none',
    style: { userSelect: 'none' },
  };

  return (
    <>
      <circle
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(invert ? (1 / value) * base : value * base)}
        onMouseEnter={() => onHover(invert ? (1 / value) * base : value * base)}
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      {unit !== 'ratio' && (
        <text x={x} y={y + r / 5} {...(text as any)}>
          {label}
        </text>
      )}
      {unit === 'ratio' && (
        <>
          <text x={x} y={y - r / 4} {...(text as any)}>
            {top}
          </text>
          <text x={x} y={y + r / 2 + text.fontSize / 4} {...(text as any)}>
            {bottom}
          </text>
          <line
            x1={x - r + padding * r}
            x2={x + r - padding * r}
            y1={y}
            y2={y}
            stroke="black"
            strokeWidth={strokeWidth}
            style={{ pointerEvents: 'none' }}
          />
        </>
      )}
    </>
  );
}
