import scaleDifference from '../sets/scaleDifference';
import decoratePathValues from './decoratePathValues';

test('decoratePathValues', () => {
  expect(
    [
      { path: ['D dorian', 'G mixolydian', 'C major'] },
      { path: ['D dorian', 'G mixolydian', 'C lydian'] },
      { path: ['D aeolian', 'G mixolydian', 'C major'] },
      { path: ['D aeolian', 'G mixolydian', 'C lydian'] },
      { path: ['D phrygian', 'G mixolydian', 'C major'] },
      { path: ['D phrygian', 'G mixolydian', 'C lydian'] },
    ].map(decoratePathValues((a, b) => scaleDifference(a, b) / 2))
  ).toEqual([
    {
      path: ['D dorian', 'G mixolydian', 'C major'],
      value: 0,
      values: [0, 0, 0],
    },
    {
      path: ['D dorian', 'G mixolydian', 'C lydian'],
      value: 1,
      values: [0, 0, 1],
    },
    {
      path: ['D aeolian', 'G mixolydian', 'C major'],
      value: 1,
      values: [0, 1, 0],
    },
    {
      path: ['D aeolian', 'G mixolydian', 'C lydian'],
      value: 2,
      values: [0, 1, 1],
    },
    {
      path: ['D phrygian', 'G mixolydian', 'C major'],
      value: 2,
      values: [0, 2, 0],
    },
    {
      path: ['D phrygian', 'G mixolydian', 'C lydian'],
      value: 3,
      values: [0, 2, 1],
    },
  ]);
});
