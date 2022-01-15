import { curry, pick } from 'ramda';
import Pattern from 'tidal.pegjs/dist/pattern.js';
import { unifyAST } from '../rhythmical/tree/rhythmAST';

// props per type that should be picked to be spread to the unified object
const customProps = {
  number: ['value'],
  string: ['value'],
  speed: ['rate'],
};

export const unifyPatternData = (patternData: Pattern) => {
  // console.log('unifyPatternData', patternData);
  const u = unifyAST(
    {
      getChildren: (node) => node.values || (node.value?.type ? [node.value] : null),
      map: ({ type, data, children }) => ({
        type,
        ...pick(customProps[type] || [], data),
        ...(children ? { children } : {}),
      }),
    },
    patternData
  );
  // console.log('unifiedPattern', u);
  return u;
};

// get value of fraction
const f = ({ n, d }) => n / d;
// convert tidal.pegjs event to rhythmical flat event
export const e =
  (duration, instrument) =>
  ({ value, arc: { start, end } }) => ({
    value,
    time: f(start) * duration,
    duration: (f(end) - f(start)) * duration,
    instrument,
  });

// query pattern for events
export const q = curry((start, end, duration, instrument: string, pattern: string) => {
  const p = Pattern(pattern);
  return p.query(start, end).map(e(duration, instrument));
});

// q(0, 1, 2, '[bd [hh hh] sn [hh hh]]')
// q(0, 2, 1, '<bd sn>')
// ['bd sn', 'hh*8'].map(q(0, 2, 2)).flat()

export const unifiedPattern = (pattern: string) => unifyPatternData(Pattern(pattern).__data);

// console.log('unifiedPattern', unifiedPattern('[[E3,G3,B3] [[F3,G3,Bb3] ~ <[F3,Ab3,Bb3] [F3,A3,Bb3]>]]'));

// hard coded p.__data with "type" as first prop. Pattern throws "type" to end which is not so readable
export const pData = {
  type: 'group',
  values: [
    {
      type: 'string',
      value: 'A',
    },
    {
      type: 'group',
      values: [
        {
          type: 'string',
          value: 'B',
        },
        {
          type: 'string',
          value: 'C',
        },
      ],
    },
  ],
};

export const pDataUnified = {
  type: 'group',
  children: [
    {
      type: 'string',
      value: 'A',
    },
    {
      type: 'group',
      children: [
        {
          type: 'string',
          value: 'B',
        },
        {
          type: 'string',
          value: 'C',
        },
      ],
    },
  ],
};

export const p2Data = {
  type: 'group',
  values: [
    {
      type: 'number',
      value: 0,
    },
    {
      type: 'speed',
      rate: {
        type: 'number',
        value: 4,
      },
      value: {
        type: 'group',
        values: [
          {
            type: 'number',
            value: 1,
          },
          {
            type: 'number',
            value: 2,
          },
        ],
      },
    },
    {
      type: 'onestep',
      values: [
        {
          values: [
            {
              type: 'number',
              value: 5,
            },
            {
              type: 'number',
              value: 6,
            },
            {
              type: 'number',
              value: 7,
            },
          ],
          type: 'group',
        },
      ],
    },
    {
      type: 'number',
      value: 8,
    },
  ],
};

export const p2DataUnified = unifyPatternData(p2Data);
