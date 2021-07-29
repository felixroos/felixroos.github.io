/* import React, { useRef, useEffect } from 'react';
import canUseDOM from '../canUseDOM';

// renders p5 sketch
export default function Sketch({ render: sketch, background }) {
  const elementRef = useRef<any>();
  const instance = useRef<any>();
  useEffect(() => {
    async function render(element) {
      const p5import = await import('p5');
      const P5: any = canUseDOM() ? p5import.default || p5import : null;
      if (!element || !P5 || !P5.constructor) return;
      if (instance.current && instance.current._setupDone) {
        const oldInstance = instance.current;
        instance.current = new P5(
          (s) => {
            s.frameCount = instance.current.frameCount;
            sketch(s);
          },
          element,
          true
        );
        oldInstance.remove();
      } else {
        instance.current = new P5(sketch, element, true);
      }
    }
    render(elementRef.current);
  }, [sketch]);
  useEffect(() => () => instance.current && instance.current.remove(), []);
  return <div ref={elementRef} style={{ background }} />;
}
 */