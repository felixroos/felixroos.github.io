import React from 'react';
import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { playEvents, synth, drawCallback } from './Player';
import drums from '../../../instruments/tidal';
import * as Tone from 'tone';
import { useState, useRef, useEffect } from 'react';

export default function PlayButton({ events, instruments, draw, loop }) {
  const [part, setPart] = useState<any>(false);
  const [pending, setPending] = useState(false);
  const drawLoop = useRef<any>();
  useEffect(() => {
    if (!part) {
      return;
    }
    part.removeAll();
    events.forEach((e) => part.add(e.time, e));
  }, [events]);
  function stop() {
    drawLoop.current && drawLoop.current.stop();
    part && part.stop();
    Tone.Transport.stop();
    setPart(false);
  }
  /* async function loadInstruments() {
    return await Promise.all(
      Object.keys(instruments || {}).map(async (key) => {
        if (typeof instruments[key].load === 'function') {
          return await new Promise((resolve) => {
            instruments[key] = instruments[key].load(resolve);
          });
        }
        return Promise.resolve();
      })
    );
  } */
  async function preloadInstruments() {
    const keys = Object.keys(instruments || {});
    const loaded = await Promise.all(
      keys.map((key) => {
        if (typeof instruments[key] === 'function') {
          return instruments[key]();
        }
        if (typeof instruments[key]?.load === 'function') {
          return instruments[key].load();
        }
        return instruments[key];
      })
    );
    return loaded.reduce((o, instrument, i) => ({ ...o, [keys[i]]: instrument }), {});
  }
  async function start() {
    if (pending) {
      // console.log('instruments are being loaded...');
      return;
    }
    Tone.start();
    setPending(true);
    const loadedInstruments = await preloadInstruments();
    // console.log('loaded instruments', loadedInstruments);
    // await loadInstruments();
    setPart(
      playEvents(events, {
        instruments: loadedInstruments || { synth, drums },
        loop,
      })
    );
    drawLoop.current = drawCallback(draw);
    setPending(false);
  }
  return (
    <Fab color="primary" onClick={() => (part ? stop() : start())}>
      {!part ? pending ? <CircularProgress /> : <PlayArrowIcon /> : <StopIcon />}
    </Fab>
  );
}
