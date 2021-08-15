import React, { useEffect, useState } from 'react';
import useHotKeys from './useHotkeys';

export default function HotkeyMonitor({ keys }) {
  const [held] = useHotKeys({
    keys, // activeKeys
    state: Date.now(), // state for each keypress
  });
  // update component every second
  const [time, setTime] = useState(Date.now());
  /* useEffect(() => {
    let interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []); */

  return (
    <p>
      {held.map(([key, timePressed]) => (
        <span key={key} style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}>
          {key} {Math.max(0, Math.round((time - timePressed) / 1000))}
        </span>
      ))}
    </p>
  );
}
