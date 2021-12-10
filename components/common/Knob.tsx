import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import { scaleLinear } from 'd3-scale';

export default function Knob({ size, value, onChange, min, max, label, caption, style, ...rest }: any) {
  const range = min !== undefined && max !== undefined ? [min, max] : [0, 1];
  const [rotation, setRotation] = useState(0);
  const getValue = scaleLinear().domain([-135, 135]).range(range);
  const imgRef = React.useRef<any>();

  useEffect(() => {
    // update rotation on value change
    setRotation(getValue.invert(value));
  }, [value]);

  const onDrag = useDrag(({ active, delta, shiftKey }) => {
    if (!active) {
      document.exitPointerLock();
      return;
    }
    imgRef.current.requestPointerLock();
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
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...(style || {}) }}>
      <span>{label}</span>
      <img
        ref={imgRef}
        {...onDrag()}
        style={{ width: size || 80, transform: `rotate(${rotation}deg)` }}
        src="./img/synth-ui/knob.svg"
        draggable={false}
        {...rest}
      />
      <span>{caption}</span>
    </div>
  );
}
