import React from 'react';

export function Slider({ value, min, max, onChange, onMouseDown, onMouseUp, step, ...rest }) {
  return (
    <input
      type="range"
      step={step}
      min={min || 0}
      max={max || 100}
      value={value + ''}
      onChange={(e) => onChange && onChange(parseInt(e.target.value))}
      onMouseDown={(e) => onMouseDown?.(e)}
      onMouseUp={(e) => onMouseUp?.(e)}
      {...rest}
    />
  );
}
