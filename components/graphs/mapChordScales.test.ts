import mapChordScales from './mapChordScales'

test('mapChordScales', () => {
  expect(mapChordScales(['C^7', ['Dm7', 'G7']])).toEqual(['C major', ['D dorian', 'G mixolydian']])
})