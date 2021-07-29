import React, { useState } from 'react';
import useKeyHandler from './useKeyHandler';

export default function KeyMonitor() {
  const [latest, setLatest] = useState<any>();
  useKeyHandler({
    down: setLatest,
    up: setLatest,
  });
  return (
    <p>
      <span style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}>
        {latest?.type} {latest?.key || '<press any key>'}
      </span>
    </p>
  );
}
