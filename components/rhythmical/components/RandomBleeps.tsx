import { useRef, useState } from 'react';
import * as Tone from 'tone';
import useSynth from '../../common/useSynth';

export default function RandomBleeps() {
  const { triggerAttackRelease } = useSynth({ options: { oscillator: { type: 'triangle' } } });
  const [started, setStarted] = useState(false);
  const nextEvent = useRef();
  const slice = 0.2;
  function query(time) {
    triggerAttackRelease(220 + Math.random() * 880, slice / 2, time);
  }
  function scheduleNext(_time) {
    console.log('TODO');
    /* nextEvent.current = Tone.Transport.scheduleOnce((time) => {
      query(time);
      scheduleNext(_time + slice);
    }, _time); */
  }
  function start() {
    Tone.start();
    scheduleNext(0);
    Tone.Transport.start('+0.1');
    setStarted(true);
  }
  function stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setStarted(false);
  }
  return (
    <div>
      {!started ? <button onClick={() => start()}>start</button> : <button onClick={() => stop()}>stop</button>}
    </div>
  );
}
