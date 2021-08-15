import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { tokenizeChord } from '../../common/tokenizeChord';
import { VoiceLeading, Voicing, VoicingDictionary } from '../voicings/Voicing';
const { topNoteDiff } = VoiceLeading;
const { lefthand } = VoicingDictionary;
import { piano } from '../../../instruments/piano';
import { Note, Range } from '@tonaljs/tonal';
import ChordSymbol from '../../score/ChordSymbol';
import useStateRef from '../../common/useStateRef';
import Keyboard from '../../music/Keyboard';

const dictionary = lefthand,
  voiceLeading = topNoteDiff;

export default function DynamicSchedule() {
  // const { triggerAttackRelease } = useSynth({ options: { oscillator: { type: 'triangle' } } });
  const [started, setStarted] = useState(false);
  const instrument = useRef<any>();
  const [range, setRange] = useStateRef(['E3', 'A5']);
  const [chord, setChord] = useStateRef('');
  const [activeNotes, setActiveNotes] = useStateRef([]);
  useEffect(() => {
    piano.load().then((loaded) => {
      instrument.current = loaded;
      console.log('loaded!', loaded);
    });
  }, []);
  const nextEvent = useRef<any>();
  const slice = 2;
  function query(time) {
    const availableChords = ['C^7', 'Dm7', 'F^7', 'Fm7', 'Bb7', /* 'Db^7', 'Db7', */ 'G7', 'Am7' /*  'Dm7b5' */].filter(
      (c) => c !== chord.current
    );
    setChord(randomElement(availableChords));
    // console.log('chord', lastChord.current, voicingRange.current);
    const [root] = tokenizeChord(chord.current);
    const _activeNotes = [`${root}2`].concat(
      Voicing.get(chord.current, range.current, dictionary, voiceLeading, activeNotes.current)
    );
    setActiveNotes(_activeNotes);
    _activeNotes.forEach((note) => {
      instrument.current?.triggerAttackRelease(note, slice, time);
    });
  }
  // TODO: try using Tone.Loop
  function scheduleNext(_time) {
    console.log('TODO');
    /* nextEvent.current = Tone.Transport.scheduleOnce((time) => {
      query(time);
      scheduleNext(_time + slice);
    }, _time); */
  }
  function start() {
    Tone.start();
    scheduleNext(0);
    Tone.Transport.start('+0.1');
    setStarted(true);
  }
  function stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setStarted(false);
  }
  function updateRange(e) {
    const _range = [Note.fromMidi(+e.target.value), Note.fromMidi(+e.target.value + 29)];
    setRange(_range);
  }
  function invertedRange(_range, totalRange) {
    const inside = Range.chromatic(_range);
    return Range.chromatic(totalRange).filter((n) => !inside.includes(n));
  }
  return (
    <div>
      {!started ? <button onClick={() => start()}>start</button> : <button onClick={() => stop()}>stop</button>}
      <label>
        <input type="range" onChange={updateRange} value={Note.midi(range.current[0])} min={48} max={67} step={1} />{' '}
        {range.current.join('-')}
      </label>
      <Keyboard
        options={{
          range: ['C2', 'C7'],
          colorize: [
            {
              keys: activeNotes.current,
              color: 'steelblue',
            },
            {
              keys: invertedRange(range.current, ['C2', 'C7']),
              color: '#aaa',
            },
          ],
        }}
      />
      <ChordSymbol chord={chord.current} />
      <br />
    </div>
  );
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
