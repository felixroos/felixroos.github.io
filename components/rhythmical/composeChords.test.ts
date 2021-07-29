import composeChords from './composeChords'

test('composeChords', () => {
  expect(composeChords(['C^7', ['Dm7', 'G7']], [[0, 1, 0, 1], [0, 1, 0, 1]]).map(({ value }) => value)).toEqual([])
})