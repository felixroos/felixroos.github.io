import { getRhythmChildren, makeRhythmParent, RhythmNode } from '../util';
import { astify, fromAST, rhythmAST, toAST } from './rhythmAST';

test('astify', () => {
  expect(
    astify<RhythmNode<string>>(
      getRhythmChildren,
      (node) => {
        if (Array.isArray(node) || (typeof node === 'object' && node.sequential)) {
          return 'sequential';
        }
        if (typeof node === 'object' && node.parallel) {
          return 'parallel';
        }
        return 'leaf';
      },
      ['C', ['D', 'E'], 'F']
    )
  ).toEqual({
    type: 'sequential',
    data: ['C', ['D', 'E'], 'F'],
    children: [
      { type: 'leaf', data: 'C' },
      {
        type: 'sequential',
        data: ['D', 'E'],
        children: [
          { type: 'leaf', data: 'D' },
          { type: 'leaf', data: 'E' },
        ],
      },
      { type: 'leaf', data: 'F' },
    ],
  });
});

// older:

test('rhythmAST', () => {
  expect(rhythmAST(['C', ['D', 'E'], 'F'])).toEqual({
    sequential: [
      { value: 'C' },
      {
        sequential: [{ value: 'D' }, { value: 'E' }],
      },
      { value: 'F' },
    ],
  });
});

test('toAST', () => {
  expect(
    toAST<RhythmNode<string>>(
      getRhythmChildren,
      (data, type, children) => ({
        data,
        type,
        ...(children ? { children } : {}),
      }),
      ['C', ['D', 'E'], 'F']
    )
  ).toEqual({
    type: 'array',
    data: ['C', ['D', 'E'], 'F'],
    children: [
      { type: 'literal', data: 'C' },
      {
        type: 'array',
        data: ['D', 'E'],
        children: [
          { type: 'literal', data: 'D' },
          { type: 'literal', data: 'E' },
        ],
      },
      { type: 'literal', data: 'F' },
    ],
  });
});

test('fromAST', () => {
  expect(
    fromAST<RhythmNode<string>>(makeRhythmParent, {
      children: [
        { data: 'C', type: 'literal' },
        {
          children: [
            { data: 'D', type: 'literal' },
            { data: 'E', type: 'literal' },
          ],
          data: ['D', 'E'],
          type: 'array',
        },
        { data: 'F', type: 'literal' },
      ],
      data: ['C', ['D', 'E'], 'F'],
      type: 'array',
    })
  ).toEqual(['C', ['D', 'E'], 'F']);
});
test('transformRhythm', () => {
  expect(
    fromAST<RhythmNode<string>>(makeRhythmParent, {
      children: [
        { data: 'C', type: 'literal' },
        {
          children: [
            { data: 'D', type: 'literal' },
            { data: 'E', type: 'literal' },
          ],
          data: ['D', 'E'],
          type: 'array',
        },
        { data: 'F', type: 'literal' },
      ],
      data: ['C', ['D', 'E'], 'F'],
      type: 'array',
    })
  ).toEqual(['C', ['D', 'E'], 'F']);
});
