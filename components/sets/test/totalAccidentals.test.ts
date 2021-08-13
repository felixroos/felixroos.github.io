import totalAccidentals from '../totalAccidentals';

test('totalAccidentals', () => {
  expect(totalAccidentals(['C', 'D', 'E'])).toBe(0);
  expect(totalAccidentals(['C#', 'Db', 'F##'])).toBe(4);
})