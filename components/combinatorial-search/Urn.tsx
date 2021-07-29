import React, { useState, useEffect } from 'react';
import { CirclePicker } from 'react-color';
export { Permutation } from './Permutation';

export function Urn({
  maxItems,
  minItems,
  picker,
  samples,
  canEditSamples,
  canEditOrder,
  canEditUnique,
  balls,
  uniqueItems,
  ignoreOrder,
  hideCombinations,
}) {
  maxItems = maxItems || 5;
  minItems = minItems || 2;
  balls = balls || 2;

  const [results, setResults] = useState([]);

  const [size, setSize] = useState(samples);
  const [max, setMax] = useState(size);
  const nonUniqueMax = 8;

  const scheme = [
    '#f44336',
    '#03a9f4',
    '#ffeb3b',
    '#e91e63',
    '#3f51b5',
    '#009688',
    '#ffc107',
    '#8bc34a',
    '#2196f3',
    '#ff5722',
    '#795548',
    '#00bcd4',
    '#673ab7',
    '#cddc39',
    '#ff9800',
    '#607d8b',
    '#4caf50',
    '#03a9f4',
    '#9c27b0',
  ];
  const [colors, setColors] = useState(scheme.slice(0, balls));
  const [activeIndex, setActiveIndex] = useState(-1);
  const [strictOrder, setStrictOrder] = useState(!ignoreOrder);
  const [unique, setUnique] = useState(uniqueItems !== undefined ? uniqueItems : true);

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    const listener: any =
      isBrowser &&
      window.addEventListener('click', () => {
        setActiveIndex(-1);
      });
    return () => isBrowser && window.removeEventListener('click', listener);
  }, []);

  useEffect(() => {
    setMax(colors.length);
    if (unique && size > colors.length) {
      setSize(colors.length);
    }
    setResults(picker(colors, size, strictOrder, unique));
  }, [colors, picker, size, strictOrder, unique]);

  return (
    <>
      <span>Balls in Urn:</span>
      <br />
      {colors && (
        <Combination
          colors={colors}
          activeIndex={activeIndex}
          onBallClick={(index) => {
            setActiveIndex(index);
          }}
        />
      )}
      <div style={{ display: 'flex' }}>
        {colors.length > minItems && (
          <Ball
            onClick={() => {
              colors.pop();
              setColors([...colors]);
            }}
            active={true}
            color="transparent"
            text="-"
          />
        )}
        {colors.length < maxItems && (
          <Ball
            onClick={() => {
              setColors([...colors, scheme[colors.length]]);
            }}
            active={true}
            color="transparent"
            text="+"
          />
        )}
      </div>
      {activeIndex !== -1 && (
        <CirclePicker
          color={colors[activeIndex]}
          onChangeComplete={(newColor) => {
            colors.splice(activeIndex, 1, newColor.hex);
            setColors([...colors]);
          }}
        />
      )}

      {canEditSamples && (
        <>
          <br />
          <label>
            <input
              type="number"
              value={size}
              min={1}
              max={unique ? max : nonUniqueMax}
              style={{
                borderRadius: 10,
                marginRight: 10,
                paddingLeft: 5,
                fontSize: '20px',
                width: 50,
              }}
              onChange={(e) => e.target.value && setSize(parseInt(e.target.value))}
            />
            picks
          </label>
        </>
      )}
      {canEditOrder && (
        <>
          <br />
          <label>
            <input type="checkbox" checked={strictOrder} onChange={() => setStrictOrder(!strictOrder)} />
            Strict Order
          </label>
        </>
      )}
      {canEditUnique && (
        <>
          <br />
          <label>
            <input type="checkbox" checked={unique} onChange={() => setUnique(!unique)} />
            Unique
          </label>
        </>
      )}
      {!!results.length && !hideCombinations && (
        <p>
          {results.length} Combination{results.length !== 1 ? 's' : ''} found:
        </p>
      )}
      {!hideCombinations && (
        <div
          style={{
            border: '0px solid gray',
            maxHeight: 290,
            width: 54 * (size || colors.length),
            overflow: 'auto',
            padding: 10,
            marginBottom: 20,
          }}
        >
          {results.map((colors, r) => (
            <div key={r}>
              <Combination colors={colors} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Ball({ color, onClick, active, text }: any) {
  const padding = 2;
  const size = 40;
  const dimension = size + padding * 2;
  const r = Math.floor(size / 2);
  return (
    <>
      <svg
        width={dimension}
        height={dimension}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          if (onClick) {
            onClick();
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <circle
          r={r}
          cy={r + padding}
          cx={r + padding}
          fill={color}
          strokeWidth={2}
          stroke={active ? 'gray' : 'transparent'}
        ></circle>
        {text && (
          <text x={r + padding} y={r + padding} textAnchor="middle" fill="gray">
            {text}
          </text>
        )}
      </svg>
    </>
  );
}
function Combination({ colors, onBallClick, activeIndex }: any) {
  return (
    <div style={{ display: 'flex' }}>
      {colors.map((color, c) => (
        <Ball active={activeIndex === c} onClick={() => onBallClick && onBallClick(c)} key={`${c}`} color={color} />
      ))}
    </div>
  );
}
