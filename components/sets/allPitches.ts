import { Range, Note } from '@tonaljs/tonal'
import byNoteChroma from './byNoteChroma'

export default Range.chromatic(['C3', 'B3'], { sharps: true })
  .concat(Range.chromatic(['C3', 'B3']))
  .filter((note, i, a) => a.indexOf(note) === i)
  .map(note => Note.get(note).pc)
  .sort(byNoteChroma)