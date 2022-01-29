import React, { useEffect } from 'react';
import { ValueChild } from '../helpers/objects';
import * as Tone from 'tone';
import canUseDOM from '../../canUseDOM';
import { max } from 'd3-array';
import { useState } from 'react';
import PianoRoll from './PianoRoll';
import PlayButton, { getSafeEvents } from './PlayButton';
const { PolySynth, Synth } = Tone;

export const synth =
  canUseDOM() &&
  new PolySynth({
    maxPolyphony: 12,
    voice: Synth,
    options: {
      volume: -16,
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 },
      oscillator: { type: 'fmtriangle' },
    },
  }).toDestination();

export const click =
  canUseDOM() &&
  new PolySynth({
    maxPolyphony: 12,
    voice: Synth,
    options: {
      volume: -16,
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0 },
      oscillator: { type: 'fmtriangle' },
    },
  }).toDestination();

export function playEvents(
  events: ValueChild<string>[],
  config: {
    duration?: number;
    instrument?;
    instruments?: any[];
    loop?: boolean;
    query?: (n) => void;
  } = {}
) {
  let { duration } = config;
  const playableEvents = getSafeEvents(events, duration);
  const maxEnd = max(playableEvents.map((e) => e.time + e.duration));
  duration = duration || maxEnd;
  let { loop = true, instruments = { synth } } = config;
  // console.log(playableEvents)
  let run = 0;
  const part = new Tone.Part((time, event: any) => {
    if (event.value === 'start') {
      config?.query?.(++run);
      return;
    }
    if (event.value === 'r' || !['string', 'number'].includes(typeof event.value)) {
      return;
    }
    try {
      pickInstrument(event.instrument, instruments).triggerAttackRelease(
        event.value,
        event.duration,
        time,
        event.velocity || 0.9
      );
    } catch (error) {
      console.warn('could not play event', event, error);
    }
  }, playableEvents).start(0);
  part.loop = loop;
  part.loopEnd = duration;
  Tone.Transport.start('+0.1');
  return part;
}

function pickInstrument(instrumentKey, instruments) {
  const availableInstruments = Object.keys(instruments);
  if (!availableInstruments.length) {
    //console.warn('no instruments set!');
  }
  instrumentKey = instrumentKey || availableInstruments[0];
  let instrument;
  const match = availableInstruments.find((key) => key === instrumentKey);
  if (match) {
    instrument = instruments[match];
  } else {
    const fallback = availableInstruments[0];
    //console.warn('instrument ' + instrumentKey + ' was not added to player. using ' + fallback + ' as fallback');
    instrument = instruments[fallback] || synth;
  }
  return instrument;
}

export function drawCallback(callback, grain = 1 / 30) {
  if (callback) {
    return new Tone.Loop((time) => {
      Tone.Draw.schedule(() => callback(Tone.Transport.seconds), time);
    }, grain).start(0);
  }
}

export default function Player(props) {
  const { hidePianoRoll } = props;
  const [time, setTime] = useState(0);
  // TBD with more complex tunes (swimming), calling setTime each frame will lead to hiccups after a certain time
  if (hidePianoRoll) {
    return <PlayButton {...props} draw={setTime} />;
  }
  return (
    <>
      <PianoRoll {...props} time={time} />
      <div style={{ float: 'right' }}>
        <PlayButton {...props} draw={setTime} />
      </div>
      <div style={{ clear: 'both' }} />
    </>
  );
}
