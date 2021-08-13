import chromaColor from '../chromaColor'
import scaleChroma from '../scaleChroma'

test('chromaColor', () => {
  expect(chromaColor(scaleChroma('C dorian'))).toBe('rgb(255, 64, 64)')
  expect(chromaColor(scaleChroma('B dorian'))).toBe('rgb(238, 17, 127)')
  expect(chromaColor(scaleChroma('Bb dorian'))).toBe('rgb(191, 0, 191)')
  expect(chromaColor(scaleChroma('A dorian'))).toBe('rgb(127, 17, 238)')
  expect(chromaColor(scaleChroma('Ab dorian'))).toBe('rgb(64, 64, 255)')
  expect(chromaColor(scaleChroma('G dorian'))).toBe('rgb(17, 127, 238)')
  expect(chromaColor(scaleChroma('Gb dorian'))).toBe('rgb(0, 191, 191)')
  expect(chromaColor(scaleChroma('F dorian'))).toBe('rgb(17, 238, 128)')
  expect(chromaColor(scaleChroma('E dorian'))).toBe('rgb(64, 255, 64)')
  expect(chromaColor(scaleChroma('D# dorian'))).toBe('rgb(127, 238, 17)')
  expect(chromaColor(scaleChroma('D dorian'))).toBe('rgb(191, 191, 0)');
  expect(chromaColor(scaleChroma('Db dorian'))).toBe('rgb(238, 128, 17)');
  expect(chromaColor(scaleChroma('F melodic minor'))).toBe('rgb(255, 64, 64)'); // like c major
})