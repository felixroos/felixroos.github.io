import React from 'react';
import Slider from '@material-ui/core/Slider';

export default function SpiralSettings({ state, setState, hideZoom }) {
  return (
    <>
      {!hideZoom && (
        <label>
          Zoom {state.zoom}
          <Slider
            min={0.01}
            max={2}
            step={0.0001}
            value={state.zoom}
            onChange={(e, v) => setState({ zoom: v })}
          />
        </label>
      )}
      {/* <label>
        Spin {state.spin}
        <Slider
          min={-0.25}
          max={1}
          step={0.01}
          value={state.spin}
          onChange={(e, v) => setState({ spin: v })}
        />
      </label> */}
      <label>
        Precision {state.precision}
        <Slider
          min={0.001}
          max={10}
          step={0.001}
          value={state.precision}
          onChange={(e, v) => setState({ precision: v })}
        />
      </label>
      <label>
        strokeWidth {state.strokeWidth}
        <Slider
          min={0.1}
          max={50}
          step={0.1}
          value={state.strokeWidth}
          onChange={(e, v) => setState({ strokeWidth: v })}
        />
      </label><br/>
      <label>
      octaves {state.min} - {state.max}
        <Slider
          min={0}
          max={12}
          step={1}
          value={[state.min, state.max]}
          onChange={(e, v) => setState({ min: v[0], max: v[1] })}
        />
      </label>
    </>
  );
}
