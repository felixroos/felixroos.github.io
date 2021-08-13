import rotateChroma from '../rotateChroma'
import scaleChroma from '../scaleChroma';

test('rotateChroma', () => {

  // rotate scale (keep root)
  expect(rotateChroma(1, scaleChroma('C major'))).toBe(scaleChroma('C dorian'))
  expect(rotateChroma(2, scaleChroma('C major'))).toBe(scaleChroma('C phrygian'))
  expect(rotateChroma(3, scaleChroma('C major'))).toBe(scaleChroma('C lydian'))
  expect(rotateChroma(4, scaleChroma('C major'))).toBe(scaleChroma('C mixolydian'))
  expect(rotateChroma(5, scaleChroma('C major'))).toBe(scaleChroma('C aeolian'))
  expect(rotateChroma(6, scaleChroma('C major'))).toBe(scaleChroma('C locrian'))
  expect(rotateChroma(7, scaleChroma('C major'))).toBe(scaleChroma('C major'))

  // rotate tonic (keep scale)
  expect(rotateChroma(1, scaleChroma('C major'))).toBe(scaleChroma('Bb major'))
  expect(rotateChroma(2, scaleChroma('C major'))).toBe(scaleChroma('Ab major'))
  expect(rotateChroma(3, scaleChroma('C major'))).toBe(scaleChroma('G major'))
  expect(rotateChroma(4, scaleChroma('C major'))).toBe(scaleChroma('F major'))
  expect(rotateChroma(5, scaleChroma('C major'))).toBe(scaleChroma('Eb major'))
  expect(rotateChroma(6, scaleChroma('C major'))).toBe(scaleChroma('Db major'))
  expect(rotateChroma(7, scaleChroma('C major'))).toBe(scaleChroma('C major'))


  expect(rotateChroma(-1, scaleChroma('C major'))).toBe(scaleChroma('Db major'))
  expect(rotateChroma(-2, scaleChroma('C major'))).toBe(scaleChroma('Eb major'))
  expect(rotateChroma(-3, scaleChroma('C major'))).toBe(scaleChroma('F major'))
  expect(rotateChroma(-4, scaleChroma('C major'))).toBe(scaleChroma('G major'))
  expect(rotateChroma(-5, scaleChroma('C major'))).toBe(scaleChroma('Ab major'))
  expect(rotateChroma(-6, scaleChroma('C major'))).toBe(scaleChroma('Bb major'))
  expect(rotateChroma(-7, scaleChroma('C major'))).toBe(scaleChroma('C major'))

  expect(rotateChroma(-1, scaleChroma('C major'))).toBe(scaleChroma('C locrian'))
  expect(rotateChroma(-2, scaleChroma('C major'))).toBe(scaleChroma('C aeolian'))
  expect(rotateChroma(-3, scaleChroma('C major'))).toBe(scaleChroma('C mixolydian'))
  expect(rotateChroma(-4, scaleChroma('C major'))).toBe(scaleChroma('C lydian'))
  expect(rotateChroma(-5, scaleChroma('C major'))).toBe(scaleChroma('C phrygian'))
  expect(rotateChroma(-6, scaleChroma('C major'))).toBe(scaleChroma('C dorian'))
  expect(rotateChroma(-7, scaleChroma('C major'))).toBe(scaleChroma('C major'))

  // rotation is relative to index 0 => only works with C..

  // rotate scale (keep root)
  expect(rotateChroma(1, scaleChroma('G major'))).toBe(scaleChroma('G dorian'))
  expect(rotateChroma(2, scaleChroma('G major'))).toBe(scaleChroma('G phrygian'))
  /* expect(rotateChroma(3, scaleChroma('G major'), 7)).toBe(scaleChroma('G lydian'));
  expect(rotateChroma(4, scaleChroma('G major'))).toBe(scaleChroma('G mixolydian'))
  expect(rotateChroma(5, scaleChroma('G major'))).toBe(scaleChroma('G aeolian'))
  expect(rotateChroma(6, scaleChroma('G major'))).toBe(scaleChroma('G locrian'))
  expect(rotateChroma(7, scaleChroma('G major'))).toBe(scaleChroma('G major'))


  expect(rotateChroma(1, scaleChroma('G major'))).toBe(scaleChroma('G dorian'))
  expect(rotateChroma(2, scaleChroma('G major'))).toBe(scaleChroma('G phrygian'))

  expect(rotateChroma(4, scaleChroma('G major'))).toBe(scaleChroma('G mixolydian'))
  expect(rotateChroma(5, scaleChroma('G major'))).toBe(scaleChroma('G aeolian'))
  expect(rotateChroma(6, scaleChroma('G major'))).toBe(scaleChroma('G locrian'))
  expect(rotateChroma(7, scaleChroma('G major'))).toBe(scaleChroma('G major')) */
})
