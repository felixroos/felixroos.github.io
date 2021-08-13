import rotateMode from '../rotateMode'

test('rotateMode', () => {
  expect(rotateMode('A locrian #2', 7)).toBe('B altered')
  expect(rotateMode('A locrian #2', 1)).toBe('B altered')
  expect(rotateMode('A major', 1)).toBe('B dorian')
  expect(rotateMode('A major', 7)).toBe('E mixolydian')
})
