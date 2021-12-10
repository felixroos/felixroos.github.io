import Accidentals from './Accidentals';

test('Accidentals', () => {
  expect(Accidentals('bbb').offset).toBe(-3);
  expect(Accidentals('###').offset).toBe(3);
  expect(Accidentals(3).stringify()).toBe('###');
  expect(Accidentals(-3).stringify()).toBe('bbb');
});
