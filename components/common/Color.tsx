import React from 'react';

export function Color({ color, size }) {
  size = size || 25;
  return <div style={{ backgroundColor: color, width: size, height: size, borderRadius: '50%' }} />;
}
