import { Note } from '@tonaljs/tonal';
import React from 'react';

function getClaviature({ options, onClick }) {
  const {
    range = ['A1', 'C6'],
    scaleX = 1,
    scaleY = 1,
    palette = ['#39383D', '#F2F2EF'],
    strokeWidth = 1,
    stroke = 'black',
    upperWidth = 14,
    upperHeight = 100,
    lowerHeight = 45,
    colorize = [],
    labels,
    topLabels,
  } = options || {};
  const blackPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  const offset = Note.midi(range[0]);
  const to = Note.midi(range[1]);
  const totalKeys = to - offset + 1;

  const getMidiKeys = (range) => {
    const white = [];
    const black = [];
    const to = Note.midi(range[1]);
    for (let i = offset; i <= to; i++) {
      //
      (blackPattern[i % 12] ? black : white).push(i);
    }
    return [white, black];
  };

  const [white, black] = getMidiKeys(range);
  const topWidth = upperWidth * scaleX; //
  const whiteWidth = (midi) => (midi % 12 > 4 ? 7 / 4 : 5 / 3) * topWidth;
  const whiteHeight = (upperHeight + lowerHeight) * scaleY;
  const blackHeight = upperHeight * scaleY;
  const whiteX = (midi) =>
    Array.from({ length: midi - offset }, (_, i) => i + offset).reduce(
      (sum, m) => (!blackPattern[m % 12] ? sum + whiteWidth(m) : sum),
      0
    ); // TODO: calculate mathematically

  const cDiff = 12 - (offset % 12);
  const cOffset = whiteX(cDiff + offset);
  const blackOffset = cOffset - cDiff * topWidth;

  const blackX = (index) => (index - offset) * topWidth + blackOffset;

  const colorizedMidi = colorize.map((c) => ({ ...c, keys: c.keys.map((key) => Note.midi(key)) }));
  const getColor = (midi) => colorizedMidi.find(({ keys }) => keys.includes(midi))?.color;
  const handleClick = (midi) => () => onClick?.(Note.fromMidi(midi), midi);
  const isBlack = (midi) => blackPattern[midi % 12] === 1;
  // format similar to https://www.npmjs.com/package/svgson
  return {
    name: 'svg',
    type: 'element',
    value: '',
    attributes: {
      // TODO: find correct calculation (might need blackOffset from the right)
      width: totalKeys * topWidth + topWidth + strokeWidth * 2,
      height: whiteHeight,
    },
    children: [
      ...white.map((midi) => ({
        name: 'rect',
        type: 'element',
        value: '',
        attributes: {
          className: Note.fromMidi(midi),
          key: midi,
          x: whiteX(midi),
          y: 0,
          height: whiteHeight,
          width: whiteWidth(midi),
          fill: getColor(midi) ?? palette[1],
          stroke,
          strokeWidth: `${strokeWidth}px`,
          onClick: handleClick(midi),
        },
      })),
      ...black.map((midi) => ({
        name: 'rect',
        type: 'element',
        value: '',
        attributes: {
          className: Note.fromMidi(midi),
          key: midi,
          x: blackX(midi),
          y: 0,
          width: topWidth,
          height: blackHeight,
          fill: getColor(midi) ?? palette[0],
          stroke: 'black',
          strokeWidth: `${strokeWidth}px`,
          onClick: handleClick(midi),
        },
      })),
      ...Object.entries(labels || {}).reduce((textElements, [key, value]) => {
        const midi = Note.midi(key);
        const black = isBlack(midi);
        const y = topLabels ? topWidth * 0.7 : (black ? blackHeight : whiteHeight) - topWidth * 0.7;
        const x = black || topLabels ? blackX(midi) + topWidth / 2 : whiteX(midi) + whiteWidth(midi) / 2;
        return textElements.concat([
          {
            name: 'circle',
            value,
            attributes: {
              cx: x,
              cy: y,
              r: topWidth / 2,
              fill: palette[1],
              stroke: palette[0],
            },
          },
          {
            name: 'text',
            value,
            attributes: {
              x,
              y: y + topWidth * 0.2,
              textAnchor: 'middle',
              fontFamily: 'Verdana',
              fontSize: topWidth * 0.7,
            },
          },
        ]);
      }, []),
    ],
  };
}

export default function Claviature({ options, onClick }: any) {
  const svg = getClaviature({ options, onClick });
  return (
    <svg {...svg.attributes}>
      {svg.children.map((el, i) => {
        const TagName = el.name;
        return (
          <TagName key={`${el.name}-${i}`} {...el.attributes}>
            {el.value}
          </TagName>
        );
      })}
    </svg>
  );
}

export function ClaviatureOctave() {
  const topWidth = 15;
  const blackHeight = 100;
  const whiteHeight = 145;
  const [r1, r2] = [5 / 3, 7 / 4]; // 2 different ratios for white key bottoms
  const whiteWidth = (index) => (index < 3 ? r1 : r2) * topWidth;
  const whiteX = (index) => (Math.min(index, 3) * r1 + Math.max(index - 3, 0) * r2) * topWidth;
  // const whiteX = (index) => Array.from({ length: index }, (_, i) => i).reduce((sum, w) => sum + whiteWidth(w), 0);
  return (
    <svg>
      {Array.from({ length: 7 }, (_, i) => i).map((index) => (
        <rect
          key={index}
          x={whiteX(index)}
          stroke="black"
          strokeWidth="1px"
          fill="white"
          y={0}
          width={whiteWidth(index)}
          height={whiteHeight}
        />
      ))}
      {[0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0].map(
        (place, index) => place && <rect key={index} x={index * topWidth} y={0} width={topWidth} height={blackHeight} />
      )}
    </svg>
  );
}
