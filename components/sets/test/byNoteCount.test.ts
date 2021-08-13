import { Scale } from '@tonaljs/tonal'
import byNoteCount from '../byNoteCount'

test('byNoteCount', () => {
  expect(Scale.get('dorian').intervals.length).toEqual(7);
  expect(['dorian', 'major pentatonic', 'major', 'minor pentatonic'].sort(byNoteCount)).toEqual([
    "major pentatonic",
    "minor pentatonic",
    "dorian",
    "major",
  ])
})