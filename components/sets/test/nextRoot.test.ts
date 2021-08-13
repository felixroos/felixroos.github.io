import nextRoot from '../nextRoot';

test('nextRoot', () => {
  expect(nextRoot('C major', 1)).toBe('D');
  expect(nextRoot('C major', 5)).toBe('F');
  expect(nextRoot('C major', 7)).toBe('G');
  expect(nextRoot('C major', 1, 'D')).toBe('E');
  expect(nextRoot('A locrian #2', 7)).toBe('B');
})