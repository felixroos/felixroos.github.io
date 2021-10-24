import Fraction from 'fraction.js';
import { ratioPath, ratioPoint3d } from './lattices';

test('ratios', () => {
  const f1 = new Fraction(5 / 4);
  expect(f1.n).toBe(5);
  expect(f1.d).toBe(4);
  const f2 = new Fraction(25 / 3);
  expect(f2.n).toBe(25);
  expect(f2.d).toBe(3);
});

test('ratioPath', () => {
  expect(ratioPath(3, 2)).toEqual([
    [0, 0],
    [40, 0],
  ]);
  expect(ratioPath(5, 3)).toEqual([
    [0, 0],
    [-40, 0],
    [-40, 40],
  ]);
});

test('ratioPoint3d', () => {
  expect(ratioPoint3d(1, 1)).toEqual([0, 0, 0]);
  expect(ratioPoint3d(3, 2)).toEqual([-1, 1, 0]);
  expect(ratioPoint3d(16, 9)).toEqual([4, -2]);
  expect(ratioPoint3d(126, 49)).toEqual([1, 2, 0, -1]);
  expect(ratioPoint3d(3, 1)).toEqual([0, 1]);
});
