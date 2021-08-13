import scaleChroma from '../scaleChroma'

test('scaleChroma', () => {
  expect(scaleChroma('C major')).toBe('101011010101')
  expect(scaleChroma('D dorian')).toBe('101011010101')
  expect(scaleChroma('C mixolydian')).toBe('101011010110')
  expect(scaleChroma('F major')).toBe('101011010110')
  expect(scaleChroma('G major')).toBe('101010110101')
  expect(scaleChroma('C lydian')).toBe('101010110101')
  expect(scaleChroma('D major')).toBe('011010110101')
  expect(scaleChroma('G lydian')).toBe('011010110101')
  expect(scaleChroma('Db major')).toBe('110101101010')
  expect(scaleChroma('C# major')).toBe('110101101010')
})