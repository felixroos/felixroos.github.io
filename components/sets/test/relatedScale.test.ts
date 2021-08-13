import relatedScale from '../relatedScale';

test('relatedScale', () => {
  expect(relatedScale('C major', 'D')).toBe('D dorian');
  expect(relatedScale('C major', 'Eb')).toBe('');
  expect(relatedScale('C major', 'G')).toBe('G mixolydian');
  expect(relatedScale('A locrian #2', 'B')).toBe('B altered')
})