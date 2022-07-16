import { useState } from 'react';
import Claviature from '../components/common/Claviature';

export function KeySelect({ children, onChange, onNoteOn, onNoteOff }) {
  const [selected, setSelected] = useState(new Set());
  const colorize = [{ keys: Array.from(selected), color: 'steelblue' }];
  const noteOn = (key) => {
    if (!selected.has(key)) {
      selected.add(key);
      setSelected(new Set(Array.from(selected)));
      onChange?.(Array.from(selected));
      onNoteOn?.(key);
    }
  };
  const noteOff = (key) => {
    if (selected.has(key)) {
      selected.delete(key);
      setSelected(new Set(Array.from(selected)));
      onChange?.(Array.from(selected));
      onNoteOff?.(key);
    }
  };
  /* onMouseDown={noteOn}
  onMouseUp={noteOff}
  onMouseLeave={noteOff} */
  return (
    <>
      <Claviature
        options={{
          range: ['C0', 'C8'],
          colorize,
          scaleX: 0.5,
          scaleY: 0.5,
        }}
        onClick={(key) => {
          if (selected.has(key)) {
            noteOff(key);
          } else {
            Array.from(selected).forEach((k) => noteOff(k));
            selected.clear();
            noteOn(key);
          }
        }}
      />
      <div className="select-none">{children?.(selected)}</div>
    </>
  );
}

export default KeySelect;
