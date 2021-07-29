import React, { useMemo, useRef, useEffect } from "react"

import Slider from "@material-ui/core/Slider"
import { Switch } from "@material-ui/core"

export function LambdomaSettings({ state, setState }) {
  return (
    <>
      <label>
        size {state.size}x{state.size}{" "}
        <Slider
          min={1}
          max={50}
          value={state.size}
          onChange={(e, size) => setState({ size })}
        />
      </label>
      <br />
      <label>
        radius {state.radius}px{" "}
        <Slider
          min={5}
          max={50}
          value={state.radius}
          onChange={(e, radius) => setState({ radius })}
        />
      </label>
      <label>
        angle {state.angle}°
        <Slider
          min={-45}
          max={90}
          value={state.angle}
          onChange={(e, angle) => setState({ angle })}
        />
      </label>
      <br />
      <label>
        hide expansions
        <Switch
          checked={state.hideExtensions}
          color="primary"
          onChange={(e) => setState({ hideExtensions: e.target.checked })}
        />
      </label>
      <label>
        clamp
        <Switch
          checked={state.clamp}
          color="primary"
          onChange={(e) => setState({ clamp: e.target.checked })}
        />
      </label>
      <br />
      <label>
        hide lines
        <Switch
          checked={state.hideLines}
          color="primary"
          onChange={(e) => setState({ hideLines: e.target.checked })}
        />
      </label>
      <label>
        hide zeroes
        <Switch
          checked={state.hideZeroes}
          color="primary"
          onChange={(e) => setState({ hideZeroes: e.target.checked })}
        />
      </label><br/>
      <label>
        play on hover
        <Switch
          checked={state.playOnHover}
          color="primary"
          onChange={(e) => setState({ playOnHover: e.target.checked })}
        />
      </label>
      <label>
        play with tonic
        <Switch
          checked={state.playWithTonic}
          color="primary"
          onChange={(e) => setState({ playWithTonic: e.target.checked })}
        />
      </label>
    </>
  )
}
