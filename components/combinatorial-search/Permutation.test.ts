import { Permutation } from './Permutation';

test('Permutation.connections', () => {
  expect(Permutation.connections([1, 2, 3], ([a, b]) => a < b)).toEqual([
    [1, 2],
    [1, 3],
    [2, 3],
  ]);

  expect(Permutation.connections([1, 2, 3], ([a, b]) => a > b)).toEqual([
    [2, 1],
    [3, 1],
    [3, 2],
  ]);

  expect(
    Permutation.connections(
      [1, 2, 3],
      (items) => {
        const [a, b, c] = items;
        return a > b && b > c;
      },
      3
    )
  ).toEqual([[3, 2, 1]]);

  expect(
    Permutation.connections(
      [1, 2, 3],
      (items) => {
        const [a, b, c] = items;
        return a < b && b < c;
      },
      3
    )
  ).toEqual([[1, 2, 3]]);

  expect(Permutation.connections(['A', 'B', 'C'], () => true)).toEqual([
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'C'],
  ]);
  expect(Permutation.connections([1, 2, 3], ([from, to]) => from > to)).toEqual([
    [2, 1],
    [3, 1],
    [3, 2],
  ]);
  /* expect(Permutation.connections([1, 2, 3], ([from, to]) => from > to, 3)).toEqual([[3, 2, 1]]);
  expect(Permutation.connections([1, 2, 3, 4], ([from, to]) => from > to, 3)).toEqual([
    [3, 2, 1],
    [4, 2, 1],
    [4, 3, 1],
    [4, 3, 2],
  ]); */
});
