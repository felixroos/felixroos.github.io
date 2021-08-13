import { Scale } from '@tonaljs/tonal'
import allPitches from '../allPitches'
import rotateTonic from '../rotateTonic'
import scaleModes from '../scaleModes'

test('rotateTonic diatonic', () => {
  /* expect(rotateTonic(0, 'C major', scaleModes('major'))).toBe('C major')
  expect(rotateTonic(1, 'C major', scaleModes('major'))).toBe('D dorian')
  expect(rotateTonic(2, 'C major', scaleModes('major'))).toBe('E phrygian')
  expect(rotateTonic(3, 'C major', scaleModes('major'))).toBe('F lydian')
  expect(rotateTonic(4, 'C major', scaleModes('major'))).toBe('G mixolydian')
  expect(rotateTonic(5, 'C major', scaleModes('major'))).toBe('A aeolian')
  expect(rotateTonic(6, 'C major', scaleModes('major'))).toBe('B locrian')
  expect(rotateTonic(7, 'C major', scaleModes('major'))).toBe('C major') */

  const testRoot = (root) => {
    const scale = `${root} major`;
    const { notes } = Scale.get(scale);
    const scales = [
      'major',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'aeolian',
      'locrian',
      'major',
    ]
    for (let i = 0; i <= 7; ++i) {
      expect(rotateTonic(i, scale, scaleModes('major'))).toBe(`${notes[i % notes.length]} ${scales[i % notes.length]}`)
    }
  }
  allPitches.forEach(pitch => {
    testRoot(pitch);
  })
})