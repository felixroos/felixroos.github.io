import Fraction from 'fraction.js';
import {
  addVectors,
  fractionPrimeVector,
  isPrime,
  nPrimes,
  primefactors,
  primelimit,
  primepowers,
  primes,
  primevector,
  ratioPrimePowers,
  ratioPrimeVector,
  slicePrimeVector,
  withoutFactor,
} from './prime';

test('fractions', () => {
  expect(new Fraction(256 / 243).n).toBe(256);
  expect(new Fraction(256 / 243).n).toBe(256);
  expect(new Fraction(256 / 243).d).toBe(243);
});
test('isPrime', () => {
  expect(isPrime(2)).toEqual(true);
  expect(isPrime(3)).toEqual(true);
  expect(isPrime(4)).toEqual(false);
  expect(isPrime(5)).toEqual(true);
  expect(isPrime(6)).toEqual(false);
});

test('primes', () => {
  expect(primes(1, 9)).toEqual([1, 2, 3, 5, 7]);
  expect(primes(3, 9)).toEqual([3, 5, 7]);
});
test('nPrimes', () => {
  expect(nPrimes(2)).toEqual([2, 3]);
  expect(nPrimes(4)).toEqual([2, 3, 5, 7]);
});

test('primefactors', () => {
  expect(primefactors(15)).toEqual([3, 5]);
  expect(primefactors(12)).toEqual([2, 2, 3]);
  expect(primefactors(42)).toEqual([2, 3, 7]);
  expect(primefactors(66)).toEqual([2, 3, 11]);
});
test('withoutFactor', () => {
  expect(withoutFactor(2, 30)).toBe(15);
  expect(withoutFactor(2, 60)).toBe(15);
});
test('primepowers', () => {
  expect(primepowers(66)).toEqual([
    [2, 1],
    [3, 1],
    [11, 1],
  ]);
  expect(primepowers(15)).toEqual([
    [3, 1],
    [5, 1],
  ]);
  expect(primepowers(12)).toEqual([
    [2, 2],
    [3, 1],
  ]);
  expect(primepowers(16)).toEqual([[2, 4]]);
});

test('primelimit', () => {
  expect(primelimit(12)).toEqual(3);
  expect(primelimit(15)).toEqual(5);
  expect(primelimit(16)).toEqual(2);
  expect(primelimit(66)).toEqual(11);
});

test('primevector', () => {
  expect(primevector(4)).toEqual([2]); // 2^2
  expect(primevector(12)).toEqual([2, 1]); // 2^2 + 3^1
  expect(primevector(126)).toEqual([1, 2, 0, 1]);
  expect(primevector(15)).toEqual([0, 1, 1]);
});
test('slicePrimeVector', () => {
  expect(slicePrimeVector([1, 2, 0, 1], 2)).toEqual([1, 2, 0, 1]);
  expect(slicePrimeVector([1, 2, 0, 1], 3)).toEqual([2, 0, 1]);
  expect(slicePrimeVector([1, 2, 0, 1], 5)).toEqual([0, 1]);
  expect(slicePrimeVector([1, 2, 0, 1], 3, 5)).toEqual([2, 0]);
  expect(slicePrimeVector([1, 2, 0, 1], 2, 3)).toEqual([1, 2]);
  expect(slicePrimeVector([1, 2], 2, 7)).toEqual([1, 2]);
});

test('addVectors', () => {
  expect(addVectors([3, 4], [-1, 5])).toEqual([2, 9]);
  expect(addVectors([3, 4, 1], [-1, 5])).toEqual([2, 9, 1]);
  expect(addVectors([-1, 5], [3, 4, 1])).toEqual([2, 9, 1]);
});

test('ratioPrimePowers', () => {
  expect(ratioPrimePowers(3, 2)).toEqual([
    [2, -1],
    [3, 1],
  ]);
  expect(ratioPrimePowers(4, 3)).toEqual([
    [2, 2],
    [3, -1],
  ]);
});

test('fractionPrimeVector', () => {
  expect(fractionPrimeVector(3, 2)).toEqual([-1, 1]);
  expect(fractionPrimeVector(16, 9)).toEqual([4, -2]);
  expect(fractionPrimeVector(126, 49)).toEqual([1, 2, 0, -1]);
  expect(fractionPrimeVector(3, 1)).toEqual([0, 1]);
});

// unused

test('ratioPrimeVector', () => {
  // replaced by fractionPrimeVector
  expect(ratioPrimeVector(3, 2, 2)).toEqual([-1, 1]);
  expect(ratioPrimeVector(3, 2, 3)).toEqual([1]);
  expect(ratioPrimeVector(16, 9, 2)).toEqual([4, -2]);
  expect(ratioPrimeVector(16, 9, 3)).toEqual([-2]);
});
