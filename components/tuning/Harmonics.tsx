import { Note } from "@tonaljs/tonal"
import React from "react"
import useSynth from "../common/useSynth"
import Waveform from "../synthesis/Waveform"
import { FrequencyPlot } from "./FrequencyPlot"

export function Harmonics({ state, setState, polysynth }) {
  const base = Note.freq("C4")
  const hearingRange = [20, 16000]
  const partialRange = [
    0, // Math.floor(hearingRange[0] / base)
    Math.floor(hearingRange[1] / base),
  ]

  function partials(n: number, damp = 100) {
    return Waveform[state.waveform || "triangle"](n)
  }

  const frequencies = partials(state.partials, state.damp)
  const { attack, releaseAll, notes, setNotes, synth } = polysynth || useSynth()
  return (
    <>
      <FrequencyPlot
        height={500}
        frequencies={frequencies}
        addSum={true}
        hideAxes={false}
        base={base}
        animationSpeed={state.speed / 100 / base}
        range={{
          x: [0, Math.PI],
          y: [-1, 1],
        }}
        onMouseEnter={(f, velocity) => {
          if (!notes.includes(f)) {
            synth && synth.triggerAttackRelease(f, "4n", "+0.01", velocity)
          }
        }}
      />
    </>
  )
}

/*



      <p>If we draw the above frequencies as lines, it looks like this:</p>
      <Strings
        frequencies={frequencies.map(([f]) => f * base)}
        labels={frequencies.map((_, i) => i + 1)}
        amplitudes={frequencies.map(
          ([f, a], i) => a / max<number>(frequencies.map(([f, a]) => a)) // stretches max a to full height
        )}
      />
<Grid container>
        <Grid item xs={2} style={{ textAlign: "center" }}>
          <Fab
            color="primary"
            onClick={() => {
              if (notes.length) {
                releaseAll()
              } else {
                frequencies.forEach(([f, a]) =>
                  attack({
                    notes: [f * base],
                    velocity: Math.abs(a),
                  })
                )
              }
            }}
          >
            {!!notes.length ? <StopIcon /> : <PlayArrowIcon />}
          </Fab>
        </Grid>
        <Grid container item xs>
          <Grid item xs={3}>
            <Typography>
              {state.partials}/{partialRange[1]} partial
              {state.partials !== 1 ? "s" : ""}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Slider
              min={1}
              max={partialRange[1]}
              value={state.partials}
              onChange={(_, n: number) => {
                if (n !== state.partials && notes.length) {
                  const freqs = partials(n, state.damp)
                  setNotes({
                    notes: freqs.map(([f]) => f * base),
                    velocity: freqs.map(([_, v]) => v),
                  })
                }
                setState({ partials: n })
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography>{state.speed}% speed</Typography>
          </Grid>
          <Grid item xs={9}>
            <Slider
              min={0}
              max={100}
              step={10}
              value={state.speed}
              onChange={(_, speed) => setState({ speed })}
            />
          </Grid>
        </Grid>
      </Grid>
*/
