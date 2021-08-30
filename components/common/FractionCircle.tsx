import React from 'react';
import { useMemo } from 'react';
import { frequencyColor } from '../tuning/tuning';

export default function FractionCircle({
  radius: _radius,
  cx,
  cy,
  top,
  bottom,
  base,
  border,
  strokeWidth,
  fill,
  invert,
  onClick,
  onHover,
  playOnHover,
  playWithTonic,
  onTrigger,
}: any) {
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
  onClick = onClick || play;
  onHover = onHover || (playOnHover ? play : () => {});
  base = base || 440;
  const circle = {
    radius: _radius || 30,
    padding: 0.4,
    cx: cx ?? 100,
    cy: cy ?? 100,
    fontSize: 12,
  };
  border = typeof border === 'number' ? border : 1;
  strokeWidth = typeof strokeWidth === 'number' ? strokeWidth : (circle.radius / 16) * border;
  const x = circle.cx + strokeWidth;
  const y = circle.cy + strokeWidth;
  const radius = circle.radius - strokeWidth / 2;
  const text = {
    fontSize: radius * 0.6,
    textAnchor: 'middle',
    pointerEvents: 'none',
    style: { userSelect: 'none' },
  };
  const value = useMemo(() => top / bottom, [top, bottom]);

  fill = fill || (!top || !bottom ? 'white' : frequencyColor((invert ? 1 / value : value) * base));
  return (
    <>
      <circle
        onClick={() => onClick(invert ? (1 / value) * base : value * base)}
        onMouseEnter={() => onHover(invert ? (1 / value) * base : value * base)}
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <text x={x} y={y - radius / 4} {...(text as any)}>
        {top}
      </text>
      <text x={x} y={y + radius / 2 + text.fontSize / 4} {...(text as any)}>
        {bottom}
      </text>
      <line
        x1={x - radius + circle.padding * radius}
        x2={x + radius - circle.padding * radius}
        y1={y}
        y2={y}
        stroke="black"
        strokeWidth={strokeWidth}
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
}
