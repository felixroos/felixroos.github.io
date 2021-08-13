import bySetNum from '../bySetNum'
import scaleModes from '../scaleModes'

test('bySetNum', () => {
  expect(scaleModes('major').sort(bySetNum)).toEqual([
    "lydian",
    "major",
    "mixolydian",
    "dorian",
    "aeolian",
    "phrygian",
    "locrian",
  ])
})