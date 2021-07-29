import composePhrase, { scaleNotes } from './composePhrase';

test('composePhrase', () => {
  expect(scaleNotes('C major').join(' ')).toEqual('C3 D3 E3 F3 G3 A3 B3')
  expect(scaleNotes('D dorian').join(' ')).toEqual('D3 E3 F3 G3 A3 B3 C4')

  expect(composePhrase([1, 3, 4, 5], ['C major', ['D dorian', 'G mixolydian']], [1, 1, 1, 1]).map(e => e.value)).toEqual([
    'C3', 'E3', 'D3', 'G3'
  ])

  expect(composePhrase([1, 3, 4, 5], ['C major', ['D dorian', 'G mixolydian']], [[1, 1, 1, 1], [1, 1, 1, 1]]).map(e => e.value)).toEqual([
    'C3', 'E3', 'F3', 'G3', 'D3', 'F3', 'G3', 'B3'
  ]);

  expect(composePhrase([1, 3, 4, 5], ['C major', ['D dorian', 'G mixolydian']], [[1, 1, 1, 1], [1, 1, 1, 1]]).map(e => e.value)).toEqual([
    'C3', 'E3', 'F3', 'G3', 'D3', 'F3', 'G3', 'B3'
  ]);
})