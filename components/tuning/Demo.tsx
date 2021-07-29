import React from "react"
import { Note } from "@tonaljs/tonal"
import Strings from "./Strings"
import { clamp, partials } from "./tuning"

import { Slider } from "../common/Slider"
import { LambdomaFloats } from "./LambdomaFloats"

export function Demo({ state, setState }) {
  const base = Note.freq("A4")
  const fractions = partials([-state.partials, state.partials], 1).map((fract) =>
    !state.clamp ? fract : clamp(fract, 1)
  )
  const freqs = fractions.map((fraction) => fraction * base)
  return (
    <>
      <Strings frequencies={freqs} />
      <label>
        <Slider
          min={1}
          max={24}
          value={state.partials}
          onChange={(partials) => setState({ partials })}
        />
        {state.partials} partials
      </label>
      <label>
        <Slider
          min={1}
          max={30}
          value={state.size}
          onChange={(size) => setState({ size })}
        />{" "}
        radius
      </label>{" "}
      <label>
        <input
          type="checkbox"
          checked={state.clamp}
          onChange={(e) => setState({ clamp: e.target.checked })}
        />{" "}
        clamp
      </label>
      <br />
      <LambdomaFloats floats={fractions} base={base} size={state.size} />
    </>
  )
}
