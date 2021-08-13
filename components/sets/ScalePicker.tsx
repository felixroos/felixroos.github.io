import React, { useEffect, useState } from 'react';
import { Scale } from '@tonaljs/tonal';
import SimpleSelect from '../common/SimpleSelect';
import allPitches from './allPitches';
import byNoteChroma from './byNoteChroma';
import simplifyScale from './simplifyScale';

export default function ScalePicker({ scale: scaleProp, scales: scalesProp, onChange }) {
  const { tonic: initialTonic, type: initialType } = Scale.get(scaleProp);
  const [tonic, setTonic] = useState(initialTonic);
  const [type, setType] = useState(initialType);
  const scales = scalesProp || ['major', 'minor', 'dorian', 'mixolydian', 'harmonic minor', 'melodic minor'];
  useEffect(() => {
    onChange(simplifyScale(`${tonic} ${type}`));
  }, [tonic, type]);
  useEffect(() => {
    if (scaleProp) {
      const s = Scale.get(scaleProp);
      setTonic(s.tonic);
      setType(s.type);
    }
  }, [scaleProp]);
  const changeTonic = (v) => {
    setTonic(Scale.get(simplifyScale(`${v} ${type}`)).tonic);
  };
  const changeType = (v) => {
    setTonic(Scale.get(simplifyScale(`${tonic} ${v}`)).tonic);
    setType(v);
  };
  const pitches = allPitches.concat(allPitches.includes(tonic) ? [] : [tonic]).sort(byNoteChroma);
  return (
    <>
      <SimpleSelect label="tonic" value={tonic} onChange={(v) => changeTonic(v)} values={pitches} />
      <SimpleSelect label="scale" value={type} onChange={(v) => changeType(v)} values={scales} />
    </>
  );
}
