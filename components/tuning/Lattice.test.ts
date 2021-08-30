import Fraction from 'fraction.js'
import { ratioPath } from './Lattice';
import { connections, ratioConnections } from './Lattice3d';

test('ratios', () => {
  const f1 = new Fraction(5 / 4);
  expect(f1.n).toBe(5);
  expect(f1.d).toBe(4);
  const f2 = new Fraction(25 / 3);
  expect(f2.n).toBe(25);
  expect(f2.d).toBe(3);
})

test('ratioPath', () => {
  expect(ratioPath(3, 2)).toEqual([[0, 0], [40, 0]]);
  expect(ratioPath(5, 3)).toEqual([[0, 0], [-40, 0], [-40, 40]])
});

test('connections', () => {
  expect(connections(['A', 'B', 'C'], () => true)).toEqual([
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'C']
  ]);
  expect(connections([1, 2, 3], (from, to) => from > to)).toEqual([
    [2, 1],
    [3, 1],
    [3, 2],
  ]);
  expect(connections([1, 2, 3], (from, to) => from > to, 3)).toEqual([
    [3, 2, 1],
  ]);
  expect(connections([1, 2, 3, 4], (from, to) => from > to, 3)).toEqual([
    [3, 2, 1],
    [4, 2, 1],
    [4, 3, 1],
    [4, 3, 2],
  ]);
});

test('ratioConnections', () => {
  const ratios = [3 * 1, 5 * 1, 7 * 1, 3 * 5, 3 * 7, 5 * 7];

  const [a, b] = [new Fraction(5 / 3), new Fraction(5 / 4)];
  expect([a.n, a.d, b.n, b.d]).toEqual([5, 3, 5, 4]);
  const diff = a.div(b);
  expect([diff.n, diff.d]).toEqual([])

  expect(ratioConnections(ratios, (from, to) => {
    console.log(from, to);
    const distance = from * to;
    return distance < 100;
  }).map(connection => connection.map((i: number) => ratios[i]))).toEqual([])
})