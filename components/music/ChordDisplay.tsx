import React, { useState, useMemo } from 'react';

import Keyboard from './Keyboard';
import { Note } from '@tonaljs/tonal';
import { ChordType } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { useDrag } from 'react-use-gesture';

const { PolySynth, Synth } = Tone;

const allNotes = [...Note.names(), ...Note.names().map((n) => n + 'b'), ...Note.names().map((n) => n + '#')];

function getChordNotes(tonic, symbol) {
  return ChordType.get(symbol).intervals.map((interval) => Note.transpose(tonic, interval));
}
const isBrowser = typeof window !== 'undefined';

export default function ChordDisplay() {
  const poly = useMemo(
    () => isBrowser && new PolySynth({ maxPolyphony: 32, voice: Synth, volume: -12 }).toDestination(),
    []
  );

  const [note, setNote] = useState('C3');
  const [chord, setChord] = useState('major');
  const [active, setActive] = useState(getChordNotes(note, chord));

  function attack(note) {
    const notes = getChordNotes(note, chord);
    setActive(notes);
    poly.triggerAttack(notes);
  }

  const onDrag = useDrag(({ down, first, active: _active }) => {
    if (first) {
      poly.triggerAttack(active);
    }
    if (!_active) {
      poly.triggerRelease(active);
    }
  });

  return (
    <>
      <div className="sm:flex space-y-2 sm:space-x-1 items-center">
        <select
          value={note.replace(/[0-9]/, '')}
          onChange={(e) => {
            setNote(e.target.value + '3');
            setActive(getChordNotes(e.target.value + '3', chord));
          }}
        >
          {allNotes.map((note, index) => (
            <option key={index}>{note}</option>
          ))}
        </select>
        <select
          value={chord}
          onChange={(e) => {
            setChord(e.target.value);
            setActive(getChordNotes(note, e.target.value));
          }}
        >
          {ChordType.names().map((_chord, index) => (
            <option key={index}>{_chord}</option>
          ))}
        </select>
        <button className="p-1 h-10 border border-gray-800" {...onDrag()}>
          play
        </button>
      </div>
      <Keyboard
        onAttack={(key) => {
          setNote(key.notes[0]);
          attack(key.notes[0]);
        }}
        onRelease={() => {
          poly.triggerRelease(active);
        }}
        options={{
          range: ['B2', 'C5'],
          scaleX: 1.8,
          scaleY: 1.8,
          colorize: [
            {
              color: 'yellow',
              keys: active.map((n) => Note.simplify(n)),
            },
          ],
          labels: active.reduce((l, n) => ({ ...l, [Note.simplify(n)]: n }), {}),
        }}
      />
    </>
  );
}
