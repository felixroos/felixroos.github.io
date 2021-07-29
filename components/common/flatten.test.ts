import flatten from './flatten'

test('flatten', () => {
  expect(flatten(['C^7', ['Dm7', 'G7']])).toEqual(['C^7', 'Dm7', 'G7'])
});
