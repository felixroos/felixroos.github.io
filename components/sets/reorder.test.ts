import reorder from './reorder'

test('reorder', () => {
  expect(reorder('ABCD'.split(''), 0).join('')).toBe('AAAA') //
  expect(reorder('ABCD'.split(''), 1).join('')).toBe('ABCD') //
  expect(reorder('ABCD'.split(''), 2).join('')).toBe('ACAC') //
  expect(reorder('ABCD'.split(''), 3).join('')).toBe('ADCB') //
  expect(reorder('ABCD'.split(''), 4).join('')).toBe('AAAA') //
  expect(reorder('101011010101'.split(''), 7).join('')).toBe('111111000001') // chromatic to fifths c major
  expect(reorder('111111000001'.split(''), 7).join('')).toBe('101011010101') // fifths to chromatic c major
  expect(reorder('101011010101'.split(''), 5).join('')).toBe('110000011111') // chromatic to fourths c major
  expect(reorder('110000011111'.split(''), 5).join('')).toBe('101011010101') // fourths to chromatic c major
})
