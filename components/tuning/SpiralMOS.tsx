import React from 'react';
import Spiral, { Line } from '../common/Spiral';
import { angle, frequencyColor, mos } from './tuning';
import { max as maxItem } from 'd3-array';
import IntervalMatrix from './IntervalMatrix';
import { Slider } from '@material-ui/core';

function SpiralMOS(props) {
  const {
    generator: generatorProp,
    steps: stepsProp,
    zoom: zoomProp,
    labelEnds,
    min = 1,
    showMatrix,
    showSettings,
  } = props;
  const [generator, setGenerator] = React.useState(generatorProp);
  const [steps, setSteps] = React.useState(stepsProp);
  const [zoom, setZoom] = React.useState(zoomProp);
  const ratios = mos(generator, steps);
  const maxRatio = maxItem(ratios);
  const max = Math.ceil(angle(maxRatio)) + min;
  const maxAngle = angle(maxRatio) + min;

  const state = {
    zoom: 0.11,
    spin: 0,
    precision: 4,
    min,
    // max: 4,
    max: maxAngle,
    strokeWidth: 3,
    base: 440,
    fontSize: 16,
    compression: 1,
    logarithmic: false,
    hideLabels: false,
    hideLines: false,
    ...props,
  };
  const { hideLabels, hideLines, base } = state;
  // const lineEnd = (r) => angle(r) + max - octaves(r)
  const lineEnd = (r) => {
    const clampedAngle = angle(r) % 1;
    const clampedMaxAngle = maxAngle % 1;
    const ang = clampedAngle + max - min;
    const offset = r === maxRatio || clampedAngle <= clampedMaxAngle ? 0 : -1;
    return ang + offset;
  };
  function getLines(): Line[] {
    if (hideLines) {
      return [];
    }
    return ratios.map((r) => [angle(r) + min, lineEnd(r), frequencyColor(r * base)]);
    // return ratios.map((r) => [0, lineEnd(r), frequencyColor(r * base)]);
  }
  function getLabels() {
    if (hideLabels) {
      return [];
    }
    return ratios.map((r, i) => ({
      label: i + '',
      angle: !labelEnds ? angle(r) + min : lineEnd(r),
      // angle: lineEnd(r),
      fill: frequencyColor(r * base),
      color: 'black',
    }));
  }
  return (
    <>
      <Spiral
        lines={getLines()}
        labels={getLabels()}
        width={600}
        height={600}
        stroke="gray"
        {...state}
        getRadius={(angle, maxRadius, zoom) => {
          if (state.logarithmic) {
            const compensation = 41;
            return Math.pow(2, Math.abs(angle)) * Math.abs(state.zoom * compensation);
          }
          return angle * maxRadius * zoom;
        }}
        onTrigger={(v) => {
          console.log('trigger', v);
          // harp.triggerAttackRelease(partial * state.base, 1)
        }}
      />
      {showSettings && (
        <>
          <label>
            Generator {generator}
            <Slider min={1} max={2} step={0.0001} value={generator} onChange={(e, v) => setGenerator(v)} />
          </label>
          <label>
            Steps {steps}
            <Slider min={1} max={53} step={1} value={steps} onChange={(e, v) => setSteps(v)} />
          </label>
          <label>
            Zoom {zoom}
            <Slider min={0.01} max={0.5} step={0.00001} value={zoom} onChange={(e, v) => setZoom(v)} />
          </label>
        </>
      )}
      {showMatrix && <IntervalMatrix ratios={ratios} colorizeBy="frequency" />}
    </>
  );
}

export default SpiralMOS;
