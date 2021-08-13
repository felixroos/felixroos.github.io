import React, { useEffect, useState } from 'react';
import useWebMidi from './useWebMidi';

export default function MidiSelect({ onChange, value }) {
  const [midiOutput, setMidiOutput] = useState<any>();
  const [midiReady, setMidiReady] = useState(false);
  const { outputs: midiOutputs, outputByName } = useWebMidi({
    ready: ({ outputs }) => {
      if (outputs.length) {
        setMidiOutput(value ? outputByName(value) : outputs[0]);
      }
      setMidiReady(true);
    },
  });
  useEffect(() => {
    if (midiOutput) {
      onChange?.(midiOutput);
    }
  }, [midiOutput]);
  if (!midiReady) {
    return (
      <p>
        Waiting for <a href="https://caniuse.com/midi">Web MIDI API</a>.. Reload if nothing happens
      </p>
    );
  }
  if (midiOutputs.length === 0) {
    return <p>No MIDI devices found</p>;
  }
  return (
    <select value={midiOutput.name} onChange={(e) => setMidiOutput(outputByName(e.target.value))}>
      {midiOutputs.map((output, index) => (
        <option key={index} value={output.name}>
          {output.name}
        </option>
      ))}
    </select>
  );
}
