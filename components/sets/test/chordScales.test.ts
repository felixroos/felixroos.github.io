import chordScales from '../chordScales'
import scaleModes from '../scaleModes'

test('chordScales', () => {
  expect(chordScales('m7', scaleModes('major'))).toEqual(['phrygian', 'aeolian', 'dorian'])
  expect(chordScales('Dm7', scaleModes('major'), true)).toEqual(['D phrygian', 'D aeolian', 'D dorian'])
  expect(chordScales('m7', ['minor', 'dorian', 'major'])).toEqual(['minor', 'dorian'])
  expect(chordScales('^7', ['minor', 'dorian', 'major'])).toEqual(['major'])
  // expect(chordScales('DbmM7', scaleModes('major', 'harmonic minor', 'melodic minor'), true)).toEqual(['major'])


  // expect(chordScales('Db-^7', scaleModes('major', 'harmonic minor', 'melodic minor'))).toEqual(['major'])


})