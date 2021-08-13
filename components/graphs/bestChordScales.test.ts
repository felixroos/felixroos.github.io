import scaleModes from '../sets/scaleModes';
import bestChordScales from './bestChordScales';

test('bestChordScales', () => {
  expect(bestChordScales(['Dm7', 'G7', 'C^7'], scaleModes('major'))).toEqual(['D dorian', 'G mixolydian', 'C major']);

  const attyaChords = ['Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Dm7', 'G7', 'C^7', 'C^7', 'Cm7', 'Fm7', 'Bb7', 'Eb^7', 'Ab^7', 'Am7', 'D7', 'G^7', 'G^7', 'Am7', 'D7', 'G^7', 'G^7', 'F#h7', 'B7b9', 'E^7', 'C7b13', 'Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Db-^7', 'Cm7', 'Bo7', 'Bbm7', 'Eb7', 'Ab^7', 'Gh7', 'C7b9'];
  expect(bestChordScales(attyaChords)).toEqual(
    [
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "D dorian",
      "G mixolydian",
      "C major",
      "C major",
      "C aeolian",
      "F dorian",
      "Bb mixolydian",
      "Eb major",
      "Ab lydian",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "F# locrian",
      "B phrygian dominant",
      "E lydian",
      "C altered",
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "Db- lydian",
      "C phrygian",
      "B ultralocrian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "G locrian",
      "C phrygian dominant",
    ]
  );

  expect(bestChordScales(
    // have you met miss jones
    ["F^7", "D7", "Gm7", "C7", "Am7", "Dm7", "Gm7", "C7", "Cm7", "F7", "Bb^7", "Abm7", "Db7", "Gb^7", "Em7", "A7", "D^7", "Abm7", "Db7", "Gb^7", "Gm7", "C7", "F^7", "Bb7", "Am7", "D7", "Gm7", "C7", "Am7", "D7", "Gm7", "C7", "F6", "Gm7", "C7"]
  )).toEqual([
    "F major",
    "D mixolydian b6",
    "G dorian",
    "C mixolydian",
    "A phrygian",
    "D aeolian",
    "G dorian",
    "C mixolydian",
    "C dorian",
    "F mixolydian",
    "Bb major",
    "Ab dorian",
    "Db mixolydian",
    "Gb major",
    "E dorian",
    "A mixolydian",
    "D major",
    "Ab dorian b2",
    "Db mixolydian b6",
    "Gb lydian #9",
    "G dorian",
    "C mixolydian",
    "F major",
    "Bb lydian dominant",
    "A dorian b2",
    "D mixolydian b6",
    "G dorian",
    "C mixolydian",
    "A phrygian",
    "D mixolydian b6",
    "G dorian",
    "C mixolydian",
    "F major",
    "G dorian",
    "C mixolydian",
  ])
})