import byNoteChroma from '../byNoteChroma'

test('byNoteChroma', () => {
  expect(['D', 'Dbb', 'C', 'C#'].sort(byNoteChroma)).toEqual([
    "C",
    "Dbb",
    "C#",
    "D",
  ])
})