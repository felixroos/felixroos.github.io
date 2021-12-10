import Note from './Note';

test('Note', () => {
  expect(Note('C##').tokens).toEqual(['C', '##']);
  expect(Note('C#3').tokens).toEqual(['C', '#', 3]);
  expect(Note('C4').octave).toEqual(4);
  expect(Note('C4').letter).toEqual('C');
  expect(Note('F#3').note).toEqual('F#3');
  expect(Note('F#').semitones).toEqual(6);
  expect(Note('F#3').pc).toEqual('F#');
  expect(Note('C#').accidentals.offset).toEqual(1);
  expect(Note('C##').accidentals.offset).toEqual(2);
  expect(Note('C##').accidentals.stringify()).toEqual('##');
  expect(Note('Eb').accidentals.offset).toEqual(-1);
  expect(Note('Bbb').accidentals.offset).toEqual(-2);
  expect(Note('D').transpose('3').pc).toBe('F#');
  expect(Note('D').transpose('3').transpose('b3').pc).toBe('A');
  expect(Note('C').transpose('-b3').pc).toBe('A');
  expect(Note('C').transpose('-3').pc).toBe('Ab');
});
