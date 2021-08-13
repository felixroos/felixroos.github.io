import reorderChroma from '../reorderChroma'

test('reorderChroma', () => {
  expect(reorderChroma('101011010101', 7)).toBe('111111000001') // chromatic to fifths c major
  expect(reorderChroma('111111000001', 7)).toBe('101011010101') // fifths to chromatic c major
  expect(reorderChroma('101011010101', 5)).toBe('110000011111') // chromatic to fourths c major
  expect(reorderChroma('110000011111', 5)).toBe('101011010101') // fourths to chromatic c major

  expect(reorderChroma('011010110101', 5)).toBe('000001111111') // fourths to chromatic g lydian
  expect(reorderChroma('101010110101', 5)).toBe('100000111111') // fourths to chromatic c lydian
  // any other number (not 5 or 7) will result in duplicates!
})