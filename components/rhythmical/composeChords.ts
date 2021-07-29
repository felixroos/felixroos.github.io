import { guideToneVoicings, lefthandVoicings } from './voicings/generateVoicings';
import composeEvents from './composeEvents';
import { rhythmEvents } from './tree/rhythmEvents';

export default function composeChords(chords, rhythm) {
  const voicings = guideToneVoicings(chords);
  const voicingEvents = rhythmEvents(voicings);
  return composeEvents(voicingEvents, rhythmEvents(rhythm), (voicingEvent, rhythmEvent) => {
    if (!rhythmEvent.value) {
      return; // rest
    }
    const { time, duration } = rhythmEvent
    return { ...voicingEvent, time, duration };
  })
}
