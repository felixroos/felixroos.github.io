import React, { useState, useEffect } from "react"
import { frequencyColor } from "../tuning/tuning"
import useSynth from "../common/useSynth"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import { Fab, Slider } from "@material-ui/core"
import { FrequencyPlot } from "../tuning/FrequencyPlot"
import { max } from "d3-array"

export default function Partials({ width, height, base, generator }) {
  base = base || 220
  width = width || 600
  height = height || 400
  const [n, setN] = useState(8)
  const margin = 20
  const { attack, release, notes, releaseAll, setNotes } = useSynth({
    voices: 32,
  })
  const partials = generator(n)
  const bar = width / partials.length
  const amplitudes = partials.map(([f, a]) => a)
  const maxAmplitude = parseFloat(max(amplitudes)) || 1
  useEffect(() => {
    if (notes.length) {
      setNotes({
        notes: partials.map(([f]) => f * base),
        velocity: partials.map(([_, v]) => v / maxAmplitude),
      })
    }
  }, [partials.length])

  const handleMouseEnter = (p) => {
    p <= partials.length &&
      notes.length < 2 &&
      attack({
        notes: [partials[p - 1][0] * base],
        velocity: partials[p - 1][1] / maxAmplitude,
      })
  }
  const handleMouseLeave = (p) => {
    return notes.length === 1 && release({ notes: [p * base] })
  }

  return (
    <>
      <Fab
        style={{ float: "right" }}
        color="primary"
        onClick={() => {
          if (notes.length) {
            releaseAll()
          } else {
            setNotes({
              notes: partials.map(([f]) => f * base),
              velocity: partials.map(([_, v]) => v / maxAmplitude),
            })
          }
        }}
      >
        {!!notes.length ? <StopIcon /> : <PlayArrowIcon />}
      </Fab>
      <br />
      <svg width={width} height={height}>
        {partials.map(([p, a], i) => {
          const length = (a / maxAmplitude) * (height - margin)
          const [x, y] = [(p - 1) * bar, height - length - margin]
          return (
            <React.Fragment key={i}>
              <rect
                stroke="black"
                onMouseEnter={() => handleMouseEnter(p)}
                onMouseLeave={() => handleMouseLeave(p)}
                x={x}
                y={y}
                width={bar}
                height={length}
                fill={
                  !notes.length || notes.includes(base * p)
                    ? frequencyColor(base * p)
                    : "gray"
                }
              />
              <text textAnchor="middle" x={x + bar / 2} y={height - 4}>
                {p}
              </text>
            </React.Fragment>
          )
        })}
      </svg>
      <br />
      <Slider
        step={1}
        min={1}
        max={32}
        value={n}
        onChange={(_, v: number) => setN(v)}
      />
      <br />
      <FrequencyPlot
        width={width}
        height={height}
        frequencies={partials}
        addSum={true}
        strokeWidth={4}
        hideAxes={false}
        base={base}
        animationSpeed={base / 100000}
        range={{
          x: [0, Math.PI],
          y: [-0.7, 0.7],
        }}
        onMouseEnter={(i) => handleMouseEnter(i + 1)}
        onMouseLeave={(i) => handleMouseLeave(i + 1)}
      />
    </>
  )
}
