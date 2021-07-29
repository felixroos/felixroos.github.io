import { enharmonicEquivalent } from './enharmonicEquivalent'

test('enharmonicEquivalent', () => {
  expect(enharmonicEquivalent('F2', 'E#')).toBe('E#2')
  expect(enharmonicEquivalent('B2', 'Cb')).toBe('Cb3')
  expect(enharmonicEquivalent('C2', 'B#')).toBe('B#1')
})




