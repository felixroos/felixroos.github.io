import flatten from '../common/flatten'
import { mapNestedArray } from '../rhythmical/tree/mapNestedArray'
import scaleModes from '../sets/scaleModes'
import bestChordScales from './bestChordScales'

export default function mapChordScales(chords, loop = false) {
  // TODO: allow passing rhythmical object tree (currently only nested string array supported)
  // TODO: use this in SheetGrid?!
  const scales = bestChordScales(flatten(chords), scaleModes('major', 'harmonic minor', 'melodic minor'), loop);
  let i = 0;
  return mapNestedArray(chords, (node) => {
    if (Array.isArray(node)) {
      return node;
    }
    return scales[i++];
  });
}