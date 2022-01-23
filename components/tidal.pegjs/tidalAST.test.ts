import Pattern from 'tidal.pegjs/dist/pattern.js';
import { unifiedPattern, unifyPattern } from './tidalAST';

test('unifiedPattern', () => {
  expect(unifiedPattern('[A [B C]]')).toEqual({
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
  });
  expect(unifiedPattern('[A,B,C]')).toEqual({
    type: 'layers',
    children: [
      { type: 'string', value: 'A' },
      { type: 'string', value: 'B' },
      { type: 'string', value: 'C' },
    ],
  });
});

test('sequential', () => {
  expect(unifyPattern('d3 f3 a3', true)).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'leaf',
        value: 'd3',
      },
      {
        type: 'leaf',
        value: 'f3',
      },
      {
        type: 'leaf',
        value: 'a3',
      },
    ],
  });

  expect(unifyPattern('d3 f3 a3 c4')).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'leaf',
        value: 'd3',
      },
      {
        type: 'leaf',
        value: 'f3',
      },
      {
        type: 'leaf',
        value: 'a3',
      },
      {
        type: 'leaf',
        value: 'c4',
      },
    ],
  });

  expect(unifyPattern('d3 [f3 a3]')).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'leaf',
        value: 'd3',
      },
      {
        type: 'sequential',
        children: [
          {
            type: 'leaf',
            value: 'f3',
          },
          {
            type: 'leaf',
            value: 'a3',
          },
        ],
      },
    ],
  });

  expect(unifyPattern('d3 [f3 [a3 c4]]')).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'leaf',
        value: 'd3',
      },
      {
        type: 'sequential',
        children: [
          {
            type: 'leaf',
            value: 'f3',
          },
          {
            type: 'sequential',
            children: [
              {
                type: 'leaf',
                value: 'a3',
              },
              {
                type: 'leaf',
                value: 'c4',
              },
            ],
          },
        ],
      },
    ],
  });
});

test('parallel', () => {
  expect(unifyPattern('[d4,f4,a4,c5]')).toEqual({
    type: 'parallel',
    children: [
      {
        type: 'leaf',
        value: 'd4',
      },
      {
        type: 'leaf',
        value: 'f4',
      },
      {
        type: 'leaf',
        value: 'a4',
      },
      {
        type: 'leaf',
        value: 'c5',
      },
    ],
  });
});

/* 
dots: currently not supported by tidal.pegjs
bd . hh hh . sn . hh hh
 */

test('repeat', () => {
  expect(unifyPattern('bd hh*2 sn hh*2')).toEqual({
    type: 'sequential',
    children: [
      { type: 'leaf', value: 'bd' },
      { type: 'speed', rate: { type: 'number', value: 2 }, children: [{ value: 'hh', type: 'leaf' }] },
      { type: 'leaf', value: 'sn' },
      { type: 'speed', rate: { type: 'number', value: 2 }, children: [{ value: 'hh', type: 'leaf' }] },
    ],
  });
  // TODO: rate could be just a number, as no other value is possible (or is it?)
});

test('rests', () => {
  expect(unifyPattern('bd ~')).toEqual({
    type: 'sequential',
    children: [{ type: 'leaf', value: 'bd' }, { type: 'rest' }],
  });
  // TODO: rate could be just a number, as no other value is possible (or is it?)
});

test('slow down', () => {
  expect(Pattern('bd/2 hh').__data).toEqual({
    type: 'group',
    values: [
      {
        type: 'onestep',
        values: [
          {
            type: 'group',
            values: [
              {
                type: 'string',
                value: 'bd',
              },
              {
                type: 'rest',
              },
            ],
          },
        ],
      },
      {
        type: 'string',
        value: 'hh',
      },
    ],
  });
  expect(unifyPattern('bd/2 hh')).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'onestep',
        children: [
          {
            type: 'sequential', // couldn't this also be directly in onestep?
            children: [{ type: 'leaf', value: 'bd' }, { type: 'rest' }],
          },
        ],
      },
      { type: 'leaf', value: 'hh' },
    ],
  });
  // TODO: rate could be just a number, as no other value is possible (or is it?)

  expect(unifyPattern('[bd hh ~ hh]/2')).toEqual({
    type: 'onestep',
    children: [
      {
        type: 'sequential', // couldn't this also be directly in onestep?
        children: [
          {
            type: 'sequential',
            children: [
              { type: 'leaf', value: 'bd' },
              { type: 'leaf', value: 'hh' },
              { type: 'rest' },
              { type: 'leaf', value: 'hh' },
            ],
          },
          { type: 'rest' },
        ],
      },
    ],
  });
});

test('onestep', () => {
  expect(unifyPattern('<bd sn> hh')).toEqual({
    type: 'sequential',
    children: [
      {
        type: 'onestep',
        children: [
          {
            type: 'sequential', // couldn't this also be directly in onestep?
            children: [
              { type: 'leaf', value: 'bd' },
              { type: 'leaf', value: 'sn' },
            ],
          },
        ],
      },
      { type: 'leaf', value: 'hh' },
    ],
  });
});

test('polymeter', () => {
  // expect(unifyPattern('bd(3,8)')).toEqual({});
  expect(unifyPattern('{bd bd hh, mt ht}')).toEqual({
    type: 'polymeter',
    children: [
      {
        type: 'sequential',
        children: [
          {
            type: 'leaf',
            value: 'bd',
          },
          {
            type: 'leaf',
            value: 'bd',
          },
          {
            type: 'leaf',
            value: 'hh',
          },
        ],
      },
      {
        type: 'sequential',
        children: [
          {
            type: 'leaf',
            value: 'mt',
          },
          {
            type: 'leaf',
            value: 'ht',
          },
        ],
      },
    ],
  });
});

// not supported:
// bd hh!2 sn hh!2
// bd hh ! sn hh !
// bd hh@2 sn hh@2
// bd hh _ sn hh _
// [bd|sn] hh
// bd hh? sn hh?
// bd hh sn:2 hh
// bd(3,8)
// {bd cp hh}%8
