import { Note, Scale } from '@tonaljs/tonal';
import composeEvents from './composeEvents';
import { rhythmEvents } from './tree/rhythmEvents';
import { RhythmEvent, RhythmNode } from './util';

test('composeEvents', () => {
  const scaleEvents: RhythmEvent<string>[] = rhythmEvents(['C major', ['D dorian', 'G mixolydian']] as RhythmNode<string>);
  expect(scaleEvents.map(({ time, duration, value }) => [time, duration, value])).toEqual([
    [0, 0.5, 'C major'],
    [0.5, 0.25, 'D dorian'],
    [0.75, 0.25, 'G mixolydian'],
  ]);
  const noteEvents: RhythmEvent<string>[] = rhythmEvents([[1, 2, 3, 5], [1, 2, 3, 5]] as RhythmNode<string>);

  expect(composeEvents(scaleEvents, noteEvents, (scaleEvent) => scaleEvent).map(e => e.value)).toEqual([
    'C major', 'C major', 'C major', 'C major', 'D dorian', 'D dorian', 'G mixolydian', 'G mixolydian'
  ]);

  expect(composeEvents(scaleEvents, noteEvents, (scaleEvent, noteEvent) => {
    const scaleNotes = Scale.get(scaleEvent.value).notes;
    return { ...noteEvent, value: scaleNotes[+noteEvent.value - 1] };
  }).map(e => e.value)).toEqual([
    'C', 'D', 'E', 'G', 'D', 'E', 'B', 'D'
  ]);

});