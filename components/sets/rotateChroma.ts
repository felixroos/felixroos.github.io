import { Collection } from '@tonaljs/tonal';

// rotate ones so that the nth "1" is at the start
export default function rotateChroma(n, chroma) {
  const digits = chroma.split('');
  const ones = digits.reduce((indices, digit, index) => indices.concat(digit === '1' ? [index] : []), []);
  const rotation = ones[(n + ones.length) % ones.length];
  return Collection.rotate(rotation, digits).join('');
};