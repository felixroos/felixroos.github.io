import Pattern from 'tidal.pegjs/dist/pattern.js';
import { queryRhythm, unifyRhythm } from '../rhythmical/tree/rhythmAST';
import { query, transform, transformEvents } from './query';
import { queryPattern, unifyPattern } from './queryPattern';

const r1 = ['A', ['B', 'C']];
const p1 = 'A [B C]';
const ast1 = {
  type: 'sequential',
  children: [
    { type: 'leaf', value: 'A' },
    {
      type: 'sequential',
      children: [
        { type: 'leaf', value: 'B' },
        { type: 'leaf', value: 'C' },
      ],
    },
  ],
};
const ast1_ = {
  type: 'sequential',
  start: 0,
  end: 1,
  children: [
    { start: 0, end: 0.5, type: 'leaf', value: 'A' },
    {
      type: 'sequential',
      start: 0.5,
      end: 1,
      children: [
        { start: 0.5, end: 0.75, type: 'leaf', value: 'B' },
        { start: 0.75, end: 1, type: 'leaf', value: 'C' },
      ],
    },
  ],
};
const events1 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 0.75, type: 'leaf', value: 'B' },
  { start: 0.75, end: 1, type: 'leaf', value: 'C' },
];
const events1playable = [
  { time: 0, duration: 0.5, type: 'leaf', value: 'A' },
  { time: 0.5, duration: 0.25, type: 'leaf', value: 'B' },
  { time: 0.75, duration: 0.25, type: 'leaf', value: 'C' },
];

const r2 = { parallel: ['A', ['B', 'C']] };
const p2 = '[A,[B C]]';
const ast2 = {
  type: 'parallel',
  children: [
    { type: 'leaf', value: 'A' },
    {
      type: 'sequential',
      children: [
        { type: 'leaf', value: 'B' },
        { type: 'leaf', value: 'C' },
      ],
    },
  ],
};
const ast2_ = {
  type: 'parallel',
  start: 0,
  end: 1,
  children: [
    { start: 0, end: 1, type: 'leaf', value: 'A' },
    {
      type: 'sequential',
      start: 0,
      end: 1,
      children: [
        { start: 0, end: 0.5, type: 'leaf', value: 'B' },
        { start: 0.5, end: 1, type: 'leaf', value: 'C' },
      ],
    },
  ],
};
const events2 = [
  { start: 0, end: 1, type: 'leaf', value: 'A' },
  { start: 0, end: 0.5, type: 'leaf', value: 'B' },
  { start: 0.5, end: 1, type: 'leaf', value: 'C' },
];
const events2playable = [
  { time: 0, duration: 1, type: 'leaf', value: 'A' },
  { time: 0, duration: 0.5, type: 'leaf', value: 'B' },
  { time: 0.5, duration: 0.5, type: 'leaf', value: 'C' },
];

const p3 = 'A <B C>';
const ast3 = {
  type: 'sequential',
  children: [
    { type: 'leaf', value: 'A' },
    {
      type: 'onestep',
      children: [
        {
          type: 'sequential', // why is this sequential group there?
          children: [
            { type: 'leaf', value: 'B' },
            { type: 'leaf', value: 'C' },
          ],
        },
      ],
    },
  ],
};
const ast3_0 = {
  type: 'sequential',
  start: 0,
  end: 1,
  children: [
    { type: 'leaf', value: 'A', start: 0, end: 0.5 },
    {
      type: 'onestep',
      start: 0.5,
      end: 1,
      children: [
        { type: 'leaf', value: 'B', start: 0.5, end: 1, index: 0 },
        // { type: 'leaf', value: 'C', start: 0.5, end: 1 }, // start += i, end += i
      ],
    },
  ],
};
const ast3_1 = {
  type: 'sequential',
  start: 0,
  end: 1,
  children: [
    { type: 'leaf', value: 'A', start: 0, end: 0.5 },
    {
      type: 'onestep',
      start: 0.5,
      end: 1,
      children: [
        // { type: 'leaf', value: 'B', start: 0.5, end: 1 },
        { type: 'leaf', value: 'C', start: 0.5, end: 1, index: 1 }, // start += i, end += i
      ],
    },
  ],
};

const events3_0 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 1, type: 'leaf', value: 'B', index: 0 },
];
const events3_1 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 1, type: 'leaf', value: 'C', index: 1 },
];

const p4 = 'A <B <C D>>';
// <bd <sn <hh cp>>>
const ast4 = {
  type: 'sequential',
  children: [
    { type: 'leaf', value: 'A' },
    {
      type: 'onestep',
      children: [
        {
          type: 'sequential',
          children: [
            { type: 'leaf', value: 'B' },
            {
              type: 'onestep',
              children: [
                {
                  type: 'sequential',
                  children: [
                    { type: 'leaf', value: 'C' },
                    { type: 'leaf', value: 'D' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
const ast4_0 = {}; // TODO: ?
const events4_0 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 1, type: 'leaf', value: 'B', index: 0 },
];
const events4_1 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 1, type: 'leaf', value: 'C', index: 0 },
];
const events4_3 = [
  { start: 0, end: 0.5, type: 'leaf', value: 'A' },
  { start: 0.5, end: 1, type: 'leaf', value: 'D', index: 1 },
];

test('unifyRhythm', () => {
  expect(unifyRhythm(r1)).toEqual(ast1);
  expect(unifyPattern(p1)).toEqual(ast1);

  expect(unifyRhythm(r2)).toEqual(ast2);
  expect(unifyPattern(p2)).toEqual(ast2);

  expect(Pattern(p3).__data).toEqual({
    type: 'group',
    values: [
      { type: 'string', value: 'A' },
      {
        type: 'onestep',
        values: [
          {
            type: 'group',
            values: [
              { type: 'string', value: 'B' },
              { type: 'string', value: 'C' },
            ],
          },
        ],
      },
    ],
  });
  expect(unifyPattern(p3)).toEqual(ast3);
  expect(unifyPattern(p4)).toEqual(ast4);
});

test('transform', () => {
  expect(transform(ast1)).toEqual(ast1_);
  expect(transform(ast1)).toEqual(ast1_); // immutability check
  expect(transform(ast2)).toEqual(ast2_);
  expect(transform(ast2)).toEqual(ast2_); // immutability check
  expect(transform(ast3)).toEqual(ast3_0);
  expect(transform(ast3)).toEqual(ast3_0); // immutability check
  expect(transform(ast3, { query: 1 })).toEqual(ast3_1);
  expect(transform(ast3, { query: 2 })).toEqual(ast3_0);
  expect(transform(ast3, { query: 3 })).toEqual(ast3_1);
  // expect(transform(ast4)).toEqual(ast4_0); // TODO: add ast
});

test('query', () => {
  expect(query(ast1)).toEqual(events1);
  expect(query(ast2)).toEqual(events2);
  expect(query(ast3)).toEqual(events3_0);
  expect(query(ast3, 1)).toEqual(events3_1);
  expect(query(ast3, 2)).toEqual(events3_0);
});

test('queryRhythm', () => {
  expect(queryRhythm(r1)).toEqual(events1);
  expect(queryPattern(p1)).toEqual(events1);
  expect(queryRhythm(r2)).toEqual(events2);
  expect(queryPattern(p2)).toEqual(events2);
  expect(queryPattern(p4)).toEqual(events4_0);
  expect(queryPattern(p4, 1)).toEqual(events4_1);
  expect(queryPattern(p4, 2)).toEqual(events4_0);
  expect(queryPattern(p4, 3)).toEqual(events4_3);
});

test('transformEvents', () => {
  expect(transformEvents(events1)).toEqual(events1playable);
  expect(transformEvents(events2)).toEqual(events2playable);
});
