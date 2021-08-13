import simplifyScale from '../simplifyScale';

test('simplifyScale', () => {
  expect(simplifyScale('C dorian')).toBe('C dorian');
  expect(simplifyScale('Gb locrian')).toBe('F# locrian');
  expect(simplifyScale('Gb major')).toBe('Gb major');
  expect(simplifyScale('F# major')).toBe('F# major');
})