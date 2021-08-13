import nextOne from './nextOne'

test('nextOne', () => {
  expect(nextOne('101', 0)).toBe(2)
  expect(nextOne('101', 2)).toBe(0)
  expect(nextOne('10001', 4)).toBe(0)
  expect(nextOne('01001', 4)).toBe(1)
})