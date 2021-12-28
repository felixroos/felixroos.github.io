import React, { useState, useMemo } from 'react';
import { Scale, Interval, RomanNumeral, Range } from '@tonaljs/tonal';

import Keyboard from './Keyboard';
import { Note } from '@tonaljs/tonal';

import * as Tone from 'tone';

const { PolySynth, Synth } = Tone;
const allNotes = [...Note.names(), ...Note.names().map((n) => n + 'b'), ...Note.names().map((n) => n + '#')];

function getScaleWithNumerals(root, name) {
  const scale = Scale.get(`${root} ${name}`);
  const numerals = scale.intervals.map((interval) => RomanNumeral.get(Interval.get(interval)).name);
  return { ...scale, numerals };
}

const isBrowser = typeof window !== 'undefined';
export default function ScaleDisplay() {
  const poly = useMemo(
    () => isBrowser && new PolySynth({ maxPolyphony: 32, voice: Synth, volume: -12 }).toDestination(),
    []
  );
  const range = ['B2', 'A5'];
  const [note, setNote] = useState('C');
  const [scale, setScale] = useState('major');
  const [polyphony, setPolyphony] = useState(1);
  const [stepInterval, setStepInterval] = useState(2);
  const { notes, numerals, intervals } = getScaleWithNumerals(note, scale);
  const [active, setActive] = useState([]);

  function getStepChord(root, count = 3, step = 2) {
    let chordNotes = [root];
    for (let i = 1; i < count; ++i) {
      const lastNote = chordNotes[chordNotes.length - 1];
      const index = notes.indexOf(Note.get(lastNote).pc);
      const nextIndex = index + step;
      let nextInterval = intervals[nextIndex % intervals.length];
      if (nextIndex > intervals.length - 1) {
        nextInterval = Interval.add(nextInterval, '8P');
      }
      // make next interval relative to current root
      nextInterval = Interval.substract(nextInterval, intervals[index]);
      const nextNote = Note.transpose(lastNote, nextInterval);
      chordNotes.push(nextNote);
    }
    return chordNotes;
  }

  function getScaleNote(key) {
    return key.notes.find((n) => notes.includes(n.replace(/[0-9]/, '')));
  }

  return (
    <>
      <select value={note} onChange={(e) => setNote(e.target.value)}>
        {allNotes.map((note, index) => (
          <option key={index}>{note}</option>
        ))}
      </select>
      <select value={scale} onChange={(e) => setScale(e.target.value)}>
        {Scale.names().map((_scale, index) => (
          <option key={index}>{_scale}</option>
        ))}
      </select>
      <select value={polyphony + ''} onChange={(e) => setPolyphony(parseInt(e.target.value))}>
        {[1, 2, 3, 4, 5, 6, 7].map((p, index) => (
          <option key={index} value={p}>
            {p} note{index ? 's' : ''}
          </option>
        ))}
      </select>
      {polyphony > 1 && (
        <select value={stepInterval + ''} onChange={(e) => setStepInterval(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7].map((p, index) => (
            <option key={index} value={p}>
              stacking {['', 'seconds', 'thirds', 'fourths', 'fifths', 'sixths', 'sevenths'][p]}
            </option>
          ))}
        </select>
      )}
      <br />
      <Keyboard
        onAttack={(key) => {
          //poly.triggerAttack(key.notes[0])
          const match = getScaleNote(key);
          if (!match) {
            return;
          }
          const chord = getStepChord(match, polyphony, stepInterval);
          setActive(chord);
          poly.triggerAttack(chord);
        }}
        onRelease={(key) => {
          /* poly.triggerRelease(key.notes[0]) */
          const match = getScaleNote(key);
          if (!match) {
            return;
          }
          const chord = getStepChord(match, polyphony, stepInterval);
          setActive([]);
          poly.triggerRelease(chord);
        }}
        options={{
          range,
          scaleX: 1.2,
          scaleY: 1.2,
          /* visibleKeys: notes, */
          colorize: [
            {
              color: 'yellow',
              keys: active.map((n) => Note.simplify(n)),
            },
            {
              color: 'lightblue',
              keys: Range.chromatic(range)
                .filter((n) => !!notes.find((note) => Note.chroma(note) === Note.chroma(n)))
                .map((n) => Note.simplify(n)),
            },
          ],
          labels: intervals
            .map((i) => Note.transpose(note + '3', i))
            .reduce((all, n, i) => ({ ...all, [n]: numerals[i] }), {}),
        }}
      />
    </>
  );
}
