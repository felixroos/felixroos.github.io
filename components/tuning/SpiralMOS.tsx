import React, { useEffect } from 'react';
import Spiral, { Line } from '../common/Spiral';
import { angle, frequencyColor, mos } from './tuning';
import { max as maxItem } from 'd3-array';
import IntervalMatrix from './IntervalMatrix';
import { Slider } from '@material-ui/core';

const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;

function SpiralMOS(props) {
  const {
    generator: generatorProp = 3 / 2,
    steps: stepsProp,
    zoom: zoomProp = 0.11,
    labelEnds,
    min = 1,
    showMatrix,
    showSettings,
    minSteps = 1,
    maxSteps = 31,
    minGenerator = 1,
    maxGenerator = 2,
    minZoom = 0.01,
    maxZoom = 0.5,
    showGeneratorSlider = true,
    generatorPresets = [
      { label: '4/3', value: 4 / 3 },
      { label: '3/2', value: 3 / 2 },
      { label: '7/4', value: 7 / 4 },
      { label: '9/5', value: 9 / 5 },
      { label: '2^(5/12)', value: Math.pow(2, 5 / 12) },
      { label: '2^(7/12)', value: Math.pow(2, 7 / 12) },
      { label: '2^(1/2)', value: Math.pow(2, 1 / 2) },
      { label: '2^(1/3)', value: Math.pow(2, 1 / 3) },
      { label: '2^(1/4)', value: Math.pow(2, 1 / 4) },
      { label: '2^(1/5)', value: Math.pow(2, 1 / 5) },
      { label: '2^(1/6)', value: Math.pow(2, 1 / 6) },
      { label: '2^(1/7)', value: Math.pow(2, 1 / 7) },
      { label: '2^(1/8)', value: Math.pow(2, 1 / 8) },
      { label: '2^(1/9)', value: Math.pow(2, 1 / 9) },
      { label: '2^(1/10)', value: Math.pow(2, 1 / 10) },
      { label: '2^(1/11)', value: Math.pow(2, 1 / 11) },
      { label: '2^(1/12)', value: Math.pow(2, 1 / 12) },
    ],
    showStepSlider = true,
    showZoomSlider = true,
  } = props;
  const [generator, setGenerator] = React.useState(generatorProp);
  const [steps, setSteps] = React.useState(stepsProp);
  const [zoom, setZoom] = React.useState(zoomProp);
  const ratios = mos(generator, steps);
  const maxRatio = maxItem(ratios);
  const max = Math.ceil(angle(maxRatio)) + min;
  const maxAngle = angle(maxRatio) + min;

  useEffect(() => {
    setGenerator(generatorProp);
  }, [generatorProp]);
  useEffect(() => {
    setSteps(stepsProp);
  }, [stepsProp]);

  const state = {
    zoom,
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
        <div>
          {showGeneratorSlider && (
            <label>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                Generator {generator}{' '}
                <select
                  onChange={(e) => {
                    console.log(e.target.value);
                    setGenerator(e.target.value);
                  }}
                >
                  <option>preset...</option>
                  {generatorPresets.map(({ label, value }, i) => (
                    <option key={i} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <Slider
                min={minGenerator}
                max={maxGenerator}
                step={0.0001}
                value={generator}
                onChange={(e, v) => setGenerator(v)}
              />
            </label>
          )}
          {showStepSlider && (
            <label>
              Notes {steps}
              <Slider min={minSteps} max={maxSteps} step={1} value={steps} onChange={(e, v) => setSteps(v)} />
            </label>
          )}
          {showZoomSlider && (
            <label>
              Zoom {zoom}
              <Slider min={minZoom} max={maxZoom} step={0.00001} value={zoom} onChange={(e, v) => setZoom(v)} />
            </label>
          )}
        </div>
      )}
      {showMatrix && <IntervalMatrix ratios={ratios} colorizeBy="frequency" />}
    </>
  );
}

export default SpiralMOS;
