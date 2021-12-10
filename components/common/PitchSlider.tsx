import React, { useEffect, useMemo, useState } from 'react';
import { Synth } from 'tone';
import canUseDOM from '../canUseDOM';
import Knob from './Knob';
import { Plot } from './Plot';
import { Slider } from './Slider';
import useSynth from './useSynth';

export const PitchSlider = () => {
  const [freq, setFreq] = useState(400);
  const [fine, setFine] = useState(40);
  const synth = useMemo(() => canUseDOM() && new Synth().toDestination(), []);
  function logslider(position, sliderMin, sliderMax, valueMin, valueMax) {
    // position will be between 0 and 100
    // The result should be between 100 an 10000000
    var minV = Math.log(valueMin);
    var maxV = Math.log(valueMax);
    // calculate adjustment factor
    var scale = (maxV - minV) / (sliderMax - sliderMin);
    return Math.exp(minV + scale * (position - sliderMin));
  }

  const control = (isFine = false) => ({
    size: 80,
    value: isFine ? fine : freq,
    onChange(v) {
      // console.log('v', v);
      // const frequency = logslider(v, 100, 2000, 100, 2000);
      let frequency;
      if (isFine) {
        frequency = freq + v;
        setFine(v);
      } else {
        frequency = v + fine;
        setFreq(v);
        // synth.set({ frequency });
      }
      synth.frequency.rampTo(frequency, 0.1);
    },
    onMouseDown() {
      synth.triggerAttack(freq + fine, 0);
    },
    onMouseUp() {
      synth.triggerRelease(0);
    },
    label: isFine ? 'Fine' : 'Coarse',
    caption: (isFine ? '+' : '') + Math.round(isFine ? fine : freq) + 'Hz',
  });

  function scaledLog(max) {
    return (x) => Math.log(100 * x) / Math.log(2);
  }

  // Math.log(max * 10 * x) / Math.log(2) = max

  return (
    <>
      <Knob min={100} max={1600} {...control()} style={{ marginRight: 16 }} />
      <Knob min={0} max={100} {...control(true)} />
      <Plot functions={[scaledLog(10), (x) => x]} range={{ x: [0, 10], y: [0, 10] }} width={800} height={200} />
      <Plot
        logX
        functions={[scaledLog(10), (x) => x]}
        range={{ x: [0.01, 10], y: [0.0001, 10] }}
        width={800}
        height={200}
      />
      {/* <Slider style={{ width: '100%' }} min={100} max={1600} step={0.1} {...control} /> */}
    </>
  );
};
