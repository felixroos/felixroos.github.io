import { editAST } from '../rhythmical/tree/editAST';
import { mapAST } from '../rhythmical/tree/rhythmAST';
import { sequence, sequentialToArc, simpleArc, stack, RhythmNode } from './morph';

const ast1: RhythmNode = {
  type: 'sequence',
  children: [
    { type: 'leaf', value: 'A' },
    {
      type: 'sequence',
      children: [
        { type: 'leaf', value: 'B' },
        { type: 'leaf', value: 'C' },
      ],
    },
  ],
};
const ast1arcs = {
  type: 'arc',
  children: [
    { value: 'A', type: 'arc', arc: '0 - 1/2' },
    {
      type: 'arc',
      arc: '1/2 - 1',
      children: [
        { value: 'B', type: 'arc', arc: '0 - 1/2' },
        { value: 'C', type: 'arc', arc: '1/2 - 1' },
      ],
    },
  ],
};

test('sequence', () => {
  expect(sequence<string>(['A', 'B', 'C'], () => 1).map(simpleArc)).toEqual([
    '0 - 1/3', //
    '1/3 - 2/3', //
    '2/3 - 1', //
  ]);
  expect(sequence<number>([1, 2, 1], (v) => v).map(simpleArc)).toEqual([
    '0 - 1/4', //
    '1/4 - 3/4', //
    '3/4 - 1', //
  ]);
  expect(
    sequence<{ duration: number }>(
      [1, 2, 1].map((duration) => ({ duration })),
      ({ duration }) => duration
    ).map(simpleArc)
  ).toEqual([
    '0 - 1/4', //
    '1/4 - 3/4', //
    '3/4 - 1', //
  ]);
  expect(sequence<number>([1, 2, 1], (v) => v, 2).map(simpleArc)).toEqual([
    '0 - 1/2', //
    '1/2 - 3/2', //
    '3/2 - 2', //
  ]);
  // expect(editRhythmAST(ast1, sequentialToArc)).toEqual(ast1arcs);
});

test('stack', () => {
  expect(stack<string>(['A', 'B', 'C']).map(simpleArc)).toEqual([
    '0 - 1', //
    '0 - 1', //
    '0 - 1', //
  ]);
});
