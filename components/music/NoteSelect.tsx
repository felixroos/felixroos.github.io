import React from 'react';
import { Note } from '@tonaljs/tonal';

export default function NoteSelect({ onChange, value, notes }) {
  function handleChange(e) {
    onChange && onChange(e.target.value);
  }
  notes =
    notes ||
    [...Note.names().map((n) => n + 'b'), ...Note.names(), ...Note.names().map((n) => n + '#')].sort(
      (a, b) => Note.chroma(a) - Note.chroma(b)
    );
  return (
    <select value={value} onChange={handleChange}>
      {notes.map((note, index) => (
        <option key={index}>{note}</option>
      ))}
    </select>
  );
}
  