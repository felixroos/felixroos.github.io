import React from "react"
import { Plot } from "../common/Plot"
import { frequencyColor } from "./tuning"

export function PitchClasses({ frequencies, strokeWidth, range, base }: any) {
  range = range || { x: [0, 4], y: [0, base * frequencies.length*2] }
  const { width, height } = { width: 600, height: 300 }
  return (
    <>
      <Plot
        strokeWidth={strokeWidth}
        width={width}
        height={height}
        functions={frequencies.map((f) => (x) => f * Math.pow(2, x))}
        colors={frequencies.map((f) => frequencyColor(f))}
        range={range}
        grid={{ x: 10, y: frequencies.length }}
      />
    </>
  )
}
