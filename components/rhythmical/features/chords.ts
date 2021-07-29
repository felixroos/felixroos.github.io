import { Note } from '@tonaljs/tonal';
import { voicingsInRange } from '../voicings/voicingsInRange';

export const chords = ({ dictionary, range }) => ({ child, isLeaf, props, parent }) => {
  if (!isLeaf || parent.chord || child.plugin !== 'chords') { // prevent infinite loop
    return child;
  }
  let options = voicingsInRange(child.value, child.dictionary || dictionary, child.range || range);
  if (props.lastVoicing) {
    const diff = (voicing) =>
      Math.abs(
        Note.midi(props.lastVoicing[props.lastVoicing.length - 1]) -
        Note.midi(voicing[voicing.length - 1])
      );
    options = options.sort((a, b) => diff(a) - diff(b));
  }
  props.lastVoicing = options[0];
  return {
    ...child,
    chord: child.value,
    value: options[0],
    type: 'parallel'
  };
}