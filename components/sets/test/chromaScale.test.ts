import chromaScale from '../chromaScale'
import scaleChroma from '../scaleChroma';

test('chromaScale', () => {
  expect(chromaScale('101011010101', 'C')).toBe('C major');
  expect(chromaScale('101011010101', 'C', [])).toBe('');
  expect(chromaScale('101011010101', 'D')).toBe('D dorian');
  expect(chromaScale('101011010101', 'Eb')).toBe('');
  expect(chromaScale('101011010101', 'E')).toBe('E phrygian');
  expect(chromaScale(scaleChroma('C major'), 'D')).toBe('D dorian'); // see relatedScale
})