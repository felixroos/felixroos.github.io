// copy of https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import { renderScore, ScoreProps } from './score-utils';
import canUseDOM from '../../components/canUseDOM';

export function Score(props: ScoreProps) {
  props = {
    staves: [],
    clef: 'treble',
    timeSignature: '4/4',
    width: 450,
    height: 150,
    ...props,
  };
  const container = useRef();
  const rendererRef = useRef<any>();
  useEffect(() => {
    if (!canUseDOM()) {
      // console.log('score can not be rendered via SSR');
      return;
    }
    const { Renderer } = Vex.Flow;
    rendererRef.current = rendererRef.current || new Renderer(container.current, Renderer.Backends.SVG);
    renderScore({ renderer: rendererRef.current, ...props });
  }, [props.staves]);

  return <div style={{ background: 'white', padding: 10 }} ref={container} />;
}
