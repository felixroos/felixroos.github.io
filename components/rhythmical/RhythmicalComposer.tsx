import React, { useEffect, useState } from 'react';
import Player from './components/Player';
import { piano } from '../../instruments/piano';
import composePhrase from './composePhrase';
import mapChordScales from '../graphs/mapChordScales';
import composeChords from './composeChords';
import { midi } from './instruments/midi';

export default function RhythmicalComposer({ chords }) {
  const [events, setEvents] = useState<any>();
  useEffect(() => {
    const bars = chords.length;
    const duration = bars * 2;
    const withDuration = (tree) => ({ duration, sequential: tree });
    const bassPattern = [1, 5];
    const bassOctave = 2;
    const bassRhythm = withDuration(Array(bars).fill([1, 1]));
    const voicingRhythm = withDuration(
      Array(bars).fill([
        [1, 0],
        [1, 0],
      ])
    );
    const chordRhythm = withDuration(chords);
    const voicingEvents = composeChords(chordRhythm, voicingRhythm);
    const scales = withDuration(mapChordScales(chords));
    const bassEvents = composePhrase(bassPattern, scales, bassRhythm, bassOctave);
    setEvents([...voicingEvents, ...bassEvents]);
  }, [chords]);
  return (
    <>
      {events && (
        <Player hidePianoRoll={true} instruments={{ piano /* : midi('IAC-Treiber Bus 1', 1) */ }} events={events} />
      )}
    </>
  );
}
