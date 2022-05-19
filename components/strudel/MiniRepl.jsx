import { Tone, getDefaultSynth } from '@strudel.cycles/tone';
import { evalScope } from '@strudel.cycles/eval';
import canUseDOM from '../canUseDOM';
import { MiniRepl as _MiniRepl } from '@strudel.cycles/react';

const defaultSynth = canUseDOM() && getDefaultSynth();

evalScope(
  canUseDOM() ? Tone : {},
  import('@strudel.cycles/core'),
  canUseDOM() ? import('@strudel.cycles/tone') : {},
  import('@strudel.cycles/tonal'),
  import('@strudel.cycles/mini'),
  import('@strudel.cycles/midi'),
  import('@strudel.cycles/xen'),
  canUseDOM() ? import('@strudel.cycles/webaudio') : {}
);

export function MiniRepl({ tune }) {
  return (
    <_MiniRepl tune={tune} defaultSynth={defaultSynth} hideOutsideView={true} />
  );
}
