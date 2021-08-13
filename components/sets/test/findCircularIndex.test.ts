import findCircularIndex from '../findCircularIndex'

test('findCircularIndex', () => {
  const chroma = '101011010101'.split(''); // c major
  const isOne = d => d === '1';
  expect(findCircularIndex(chroma, isOne)).toBe(0)
  expect(findCircularIndex(chroma, isOne, 1)).toBe(2)
  expect(findCircularIndex(chroma, isOne, 3)).toBe(4)
  expect(findCircularIndex(chroma, isOne, 5)).toBe(5)
  expect(findCircularIndex(chroma, isOne, 6)).toBe(7)
  expect(findCircularIndex(chroma, isOne, 8)).toBe(9)
  expect(findCircularIndex(chroma, isOne, 10)).toBe(11)
});