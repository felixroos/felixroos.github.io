import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { scaleLinear } from 'd3-scale';

export default function Knob({ size, value, onChange, min, max }) {
  const range = min !== undefined && max !== undefined ? [min, max] : [0, 1];
  const [rotation, setRotation] = useState(0);
  const getValue = scaleLinear().domain([-135, 135]).range(range);

  useEffect(() => {
    // update rotation on value change
    setRotation(getValue.invert(value));
  }, [value]);

  const onDrag = useDrag(({ active, delta, shiftKey }) => {
    if (!active) {
      return;
    }
    const sensitivity = shiftKey ? 4 : 1;
    const getRotation = (moved) => -moved / sensitivity;
    const clamp = (r, min, max) => Math.min(max, Math.max(r, min));
    const _rotation = clamp(rotation + getRotation(delta[1]), -135, 135);
    if (_rotation !== rotation) {
      setRotation(_rotation);
      rotation !== _rotation && onChange?.(getValue(_rotation));
    }
  });
  return (
    <img
      {...onDrag()}
      style={{ width: size || 80, transform: `rotate(${rotation}deg)` }}
      src="../img/synth-ui/knob.svg"
      draggable={false}
    />
  );
}
