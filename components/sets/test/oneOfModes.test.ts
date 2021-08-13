import { Scale } from '@tonaljs/tonal'
import oneOfModes from '../oneOfModes'

test('oneOfModes', () => {
  expect(Scale.names().filter(oneOfModes(['major']))).toEqual([
    "lydian",
    "locrian",
    "phrygian",
    "aeolian",
    "dorian",
    "mixolydian",
    "major",
  ])
  expect(Scale.names().filter(oneOfModes(['harmonic minor']))).toEqual([
    "harmonic minor",
    "ultralocrian",
    "locrian 6",
    "romanian minor",
    "dorian #4",
    "phrygian dominant",
    "major augmented",
    "lydian #9",
  ])
  expect(Scale.names().filter(oneOfModes(['major', 'harmonic minor']))).toEqual([
    "harmonic minor",
    "lydian",
    "locrian",
    "ultralocrian",
    "locrian 6",
    "romanian minor",
    "dorian #4",
    "phrygian",
    "phrygian dominant",
    "aeolian",
    "dorian",
    "mixolydian",
    "major",
    "major augmented",
    "lydian #9",
  ])
})