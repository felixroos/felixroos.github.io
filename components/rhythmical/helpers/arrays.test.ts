import { nestArray, flatArray } from './arrays'
import { toArray } from './objects';

test('toArray', () => {
  expect(toArray('')).toEqual(['']);
  expect(toArray([])).toEqual([]);
  expect(toArray('C')).toEqual(['C']);
  expect(toArray({ m: 'C' })).toEqual([{ m: 'C' }]);
})
test('flatArray', () => {
  expect(flatArray([])).toEqual([]);
  expect(flatArray(['C'])).toEqual([
    { value: 'C', path: [[0, 1, 1]] }
  ]);
  expect(flatArray(['C', 'D'])).toEqual([
    { value: 'C', path: [[0, 1, 2]] },
    { value: 'D', path: [[1, 1, 2]] }
  ]);
  expect(flatArray([{ value: 'C4', duration: 3 }, 'D4'])).toEqual([
    { value: 'C4', path: [[0, 3, 2]] },
    { value: 'D4', path: [[1, 1, 2]] }
  ]);
  expect(flatArray(['C', 'D', ['E', 'F']])).toEqual([
    { value: 'C', path: [[0, 1, 3]] },
    { value: 'D', path: [[1, 1, 3]] },
    { value: 'E', path: [[2, 1, 3], [0, 1, 2]] },
    { value: 'F', path: [[2, 1, 3], [1, 1, 2]] }]);
})

test('nestArray', () => {
  expect(nestArray([])).toEqual([]);
  expect(nestArray([{ value: 'C', path: [[0, 1, 1]] }])).toEqual([
    'C'
  ]);
  expect(nestArray([
    { value: 'C', path: [[0, 1, 2]] },
    { value: 'D', path: [[1, 1, 2]] }
  ])).toEqual(['C', 'D']);

  expect(nestArray([
    { value: 'C', path: [[0, 1, 3]] },
    { value: 'D', path: [[1, 1, 3]] },
    { value: 'E', path: [[2, 1, 3], [0, 1, 2]] },
    { value: 'F', path: [[2, 1, 3], [1, 1, 2]] }]))
    .toEqual(['C', 'D', ['E', 'F']]);
})
