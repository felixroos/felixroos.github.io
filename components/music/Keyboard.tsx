import React, { useState, useRef } from 'react';
// import { renderSVG } from 'svg-piano';
import { renderSVG } from './svg-piano';
import { useKeyEvents } from '../useKeyEvents';
import { useGesture } from 'react-use-gesture';

export default function Keyboard({ options, onClick, onAttack, onRelease, keyControl, mouseControl }: any) {
  const active = useRef([]);
  const [colorized, setColorized] = useState([]);
  mouseControl = mouseControl ?? true;
  const onDrag = useGesture({
    onDragStart: ({ down, args: [key] }) => mouseControl && down && activate(key),
    onHover: ({ down, active, args: [key] }) => {
      if (!mouseControl) {
        return;
      }
      if (active && down) {
        activate(key);
      }
      if (!active) {
        deactivate(key);
      }
    },
  });
  useKeyEvents({
    downHandler: (e) => keyControl && keyControl[e.key] && activate({ notes: [keyControl[e.key]] }),
    upHandler: (e) => keyControl && keyControl[e.key] && deactivate({ notes: [keyControl[e.key]] }),
  });

  const activate = (key) => {
    if (!colorized.includes(key.notes[0])) {
      active.current = [...active.current, key.notes[0]];
      onAttack && onAttack(key);
    }
    setColorized(active.current);
  };

  const deactivate = (key) => {
    if (colorized.includes(key.notes[0])) {
      active.current = active.current.filter((n) => n !== key.notes[0]);
      onRelease && onRelease(key);
    }
    setColorized(active.current);
  };
  const { svg, children } = renderSVG({
    ...options,
    colorize: [...(options.colorize || []), { keys: colorized, color: 'red' }],
  });
  return (
    <div className="max-w-full overflow-auto">
      <svg {...svg}>
        {children
          .filter((c) => !!c)
          .map(({ polygon, circle, text, key }, index) => [
            polygon && (
              <polygon
                {...polygon}
                key={'p' + index}
                {...onDrag(key)}
                onMouseUp={() => deactivate(key)}
                onClick={() => onClick && onClick(key)}
              />
            ),
            circle && <circle {...circle} key={'c' + index} style={{ pointerEvents: 'none' }} />,
            text && (
              <text {...text} key={'t' + index} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {text.value}
              </text>
            ),
          ])}
      </svg>
    </div>
  );
}
