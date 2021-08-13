import chromaDifference from '../chromaDifference'
import scaleChroma from '../scaleChroma'

test('chromaDifference', () => {
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('F major'))).toBe(2)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('Bb major'))).toBe(4)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('Eb major'))).toBe(6)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('Ab major'))).toBe(8)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('Db major'))).toBe(10)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('Gb major'))).toBe(10)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('B major'))).toBe(10)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('E major'))).toBe(8)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('A major'))).toBe(6)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('D major'))).toBe(4)
  expect(chromaDifference(scaleChroma('C major'), scaleChroma('G major'))).toBe(2)
})