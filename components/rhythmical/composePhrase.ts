import { Note, Scale } from '@tonaljs/tonal';
import composeEvents from './composeEvents';
import { rhythmEvents } from './tree/rhythmEvents';

export function scaleNotes(scale, octave = 3) {
  const { tonic, intervals } = Scale.get(scale);
  const root = tonic + octave;
  return intervals.map(interval => Note.transpose(root, interval));
}

export default function composePhrase(phrase, scales, rhythm, octave = 3) {
  let i = 0;
  let lastScale;
  return composeEvents(rhythmEvents(scales), rhythmEvents(rhythm), (scaleEvent, noteEvent) => {
    if (!noteEvent.value) {
      return; // rest
    }
    const { value: scale } = scaleEvent;
    if (scale !== lastScale) {
      i = 0;
      lastScale = scale;
    }
    const step = phrase[i % phrase.length];
    const notes = scaleNotes(scale, octave);
    i++;
    return { ...noteEvent, value: notes[step - 1] };
  })
}