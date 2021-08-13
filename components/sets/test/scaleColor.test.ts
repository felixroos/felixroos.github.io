import scaleColor from '../scaleColor'

test('scaleColor', () => {
  /* expect(scaleColor('C dorian')).toBe('rgb(255, 64, 64)')
  expect(scaleColor('F dorian')).toBe('rgb(238, 17, 127)')
  expect(scaleColor('Bb dorian')).toBe('rgb(191, 0, 191)') 
  expect(scaleColor('Eb dorian')).toBe('rgb(127, 17, 238)')
  expect(scaleColor('Ab dorian')).toBe('rgb(64, 64, 255)')
  expect(scaleColor('Db dorian')).toBe('rgb(17, 127, 238)')
  expect(scaleColor('Gb dorian')).toBe('rgb(0, 191, 191)')
  expect(scaleColor('B dorian')).toBe('rgb(17, 238, 128)')
  expect(scaleColor('E dorian')).toBe('rgb(64, 255, 64)')
  expect(scaleColor('A dorian')).toBe('rgb(127, 238, 17)')
  expect(scaleColor('D dorian')).toBe('rgb(191, 191, 0)')
  expect(scaleColor('G dorian')).toBe('rgb(238, 128, 17)')
  expect(scaleColor('G melodic minor')).toBe('rgb(191, 191, 0)'); // like d dorian
  */
  expect(scaleColor('C dorian')).toBe('#f6afaf')
  expect(scaleColor('F dorian')).toBe('#e580b2')
  expect(scaleColor('Bb dorian')).toBe('#e93ce9')
  expect(scaleColor('Eb dorian')).toBe('#b280e5')
  expect(scaleColor('Ab dorian')).toBe('#afaff6')
  expect(scaleColor('Db dorian')).toBe('#80b2e5')
  expect(scaleColor('Gb dorian')).toBe('#3ce9e9')
  expect(scaleColor('B dorian')).toBe('#80e5b3')
  expect(scaleColor('E dorian')).toBe('#aff6af')
  expect(scaleColor('A dorian')).toBe('#b2e580')
  expect(scaleColor('D dorian')).toBe('#e9e93c')
  expect(scaleColor('G dorian')).toBe('#e5b380')
  expect(scaleColor('G melodic minor')).toBe('#e9e93c'); // like d dorian
})