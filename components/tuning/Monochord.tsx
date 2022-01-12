import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-use-gesture';
import { scaleLinear } from 'd3-scale';
import Fraction from 'fraction.js';
import FractionCircle from '../common/FractionCircle';
import { frequencyColor } from './tuning';
import { Plot } from '../common/Plot';
import useFrame from '../common/useFrame';
import useSynth from '../common/useSynth';

export default function Monochord({
  value,
  base,
  disableRight,
  min,
  max,
  ticks,
  width,
  factor,
  harmonic,
  amplitude: initialAmplitude,
  strokeWidth,
  draggable,
  label,
  polysynth,
  invert,
}) {
  const { triggerAttackRelease } =
    polysynth ||
    useSynth({
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
  min = min || 1 / 4;
  max = max || 1;
  base = base || 440;
  initialAmplitude = initialAmplitude || 0;
  const [amplitude, setAmplitude] = useState(initialAmplitude || 0);
  value = value || 1;
  useEffect(() => {
    set({ x: Math.min(value || 1, 1) });
  }, [value]);
  harmonic = harmonic || 1;
  factor = factor || 1 / harmonic || 1;
  disableRight = typeof disableRight === 'undefined' ? true : disableRight;
  const [{ x }, set] = useState({ x: Math.min(value || 1, 1) });
  const [firstX, setFirstX] = useState(x);
  const frequencyLeft = (1 / x) * base * (1 / factor);
  // const frequencyRight = (1 / (1 - x)) * base * (1 / factor)
  const radius = 15;
  width = width || 300;
  const margin = { left: radius * 2, right: radius * 2 };
  const colors = {
    line: 'gray',
    circle: 'rgba(100,100,100,0.5)',
  };
  ticks = ticks || 12;
  const circlePadding = radius / 2;
  strokeWidth = strokeWidth || 4;
  const innerWidth = width - margin.left - margin.right;
  const height = radius * 2;
  const drag = useDrag(({ down, movement: [mx], first }) => {
    if (first || !down) {
      setFirstX(x);
    }
    set({
      x: Math.min(max, Math.max(min, Math.round((mx / innerWidth) * ticks) / ticks + firstX)),
    });
  });

  const duration = 1000;
  const speed = frequencyLeft / 100;
  const { start, isRunning } = useFrame(({ fromStart, last, progress }) => {
    setAmplitude((initialAmplitude ? 1 : 1 - progress) * Math.sin((speed * Math.PI * 2 * fromStart) / 1000));
    if (last) {
      setAmplitude(initialAmplitude);
    }
  }, false);

  function play() {
    if (isRunning) {
      return;
    }
    start(duration);
    triggerAttackRelease(frequencyLeft, duration / 1000);
  }

  const px = scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const [lt, lb] = new Fraction(x * factor).toFraction().split('/');
  const [rt, rb] = new Fraction(factor + (1 - x)).toFraction().split('/');

  return (
    <div className="max-w-full">
      <svg width={width} height={height}>
        <g onMouseEnter={() => play()} onClick={() => play()}>
          {!label ? (
            <FractionCircle
              cx={radius}
              cy={radius - 1}
              radius={radius}
              strokeWidth={1}
              onClick={() => play()}
              onHover={() => play()}
              top={(invert ? +lb : +lt) || 1}
              bottom={(invert ? +lt : +lb) || 1}
              invert={!invert}
              base={base}
            />
          ) : (
            <g>
              <circle cx={radius} cy={radius} r={radius} fill={frequencyColor(frequencyLeft)} />
              <text
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                x={radius}
                y={radius + radius / 3}
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          )}
        </g>
        {!disableRight ? (
          <FractionCircle
            cx={width - radius - 2}
            cy={radius - 1}
            radius={radius}
            strokeWidth={1}
            top={(invert ? +rb : +rt) || 1}
            bottom={(invert ? +rt : +rb) || 1}
            invert={!invert}
            base={base}
          />
        ) : (
          <line
            stroke="gray"
            strokeWidth={2}
            x1={width - radius * 2}
            x2={width - radius * 2}
            y1={radius - 10}
            y2={radius + 10}
          />
        )}

        <g transform={`translate(${px(0)},0)`} onMouseEnter={() => play()}>
          <Plot
            margin={{ top: strokeWidth, bottom: strokeWidth, left: 0, right: 0 }}
            functions={[(_x) => amplitude * Math.sin(harmonic * _x), (_x) => -amplitude * Math.sin(harmonic * _x)]}
            range={{ x: [0, Math.PI], y: [-1, 1] }}
            hideAxes={true}
            height={radius * 2}
            colors={[frequencyColor(frequencyLeft)]}
            width={px(x) - px(0)}
            strokeWidth={strokeWidth}
            onlySVG={true}
          />
          {/* <line
          className="string-left"
          x1={0}
          x2={px(x) - px(0)}
          y1={radius}
          y2={radius}
          stroke={frequencyColor(frequencyLeft)}
          strokeWidth={strokeWidth}
        /> */}
        </g>
        <line
          className="string-right"
          x1={px(x)}
          x2={px(1)}
          y1={radius}
          y2={radius}
          {...(disableRight ? {} : { onMouseEnter: () => play() })}
          stroke={disableRight ? 'gray' : frequencyColor((1 / (x ? 1 - x : 1)) * base)}
          strokeWidth={strokeWidth}
        />
        <g style={{ pointerEvents: 'none', userSelect: 'none' }}>
          {![1, 0].includes(x) && (
            <line
              className="tick"
              y1={radius - circlePadding}
              y2={radius + circlePadding}
              x1={px(x)}
              x2={px(x)}
              stroke={colors.line}
              strokeWidth={2}
            />
          )}
        </g>
        {draggable && (
          <>
            <circle
              className="handle"
              {...drag()}
              cx={px(x)}
              cy={radius}
              style={{ cursor: 'pointer' }}
              r={radius - 2}
              strokeWidth={0}
              stroke={colors.circle}
              fill={colors.circle}
            />
          </>
        )}
      </svg>
    </div>
  );
}
