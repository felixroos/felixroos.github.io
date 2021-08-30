import React, { useState } from "react"
import { Plot } from "../common/Plot"
import { frequencyColor } from "./tuning"
import useFrame from "../common/useFrame"

export function FrequencyPlot({
  base,
  frequencies,
  addSum,
  height,
  width,
  colors,
  onMouseEnter,
  onMouseLeave,
  strokeWidth,
  autostartAnimation,
  animationSpeed,
  range,
  hideAxes,
}: any) {
  const [time, setTime] = useState(0)
  base = base || 440
  animationSpeed =
    typeof animationSpeed === "number" ? animationSpeed : 1 / base
  addSum = addSum !== undefined ? addSum : true
  const animateAmplitude = true
  const animatePhase = false
  const functions = (
    frequencies || []
  ).map(([frequency, amplitude, phase]) => (x) =>
    Math.sin(
      frequency * x +
        ((phase + (animatePhase ? (time * frequency * base) / 10 : 0)) / 180) *
          Math.PI
    ) *
    amplitude *
    (animateAmplitude ? Math.cos(time * frequency) : 1)
  )
  if (addSum) {
    const sum = (x) => functions.slice(0, -1).reduce((sum, f) => f(x) + sum, 0)
    functions.push(sum)
  }

  const { toggle } = useFrame(({ fromStart }) => {
    setTime(fromStart * animationSpeed)
  }, autostartAnimation)

  return (
    <>
      {/* <Button onClick={() => toggle()}>Toggle</Button> */}
      <Plot
        onClick={() => toggle()}
        strokeWidth={strokeWidth || 2}
        width={width}
        height={height}
        functions={functions}
        hideAxes={hideAxes !== undefined ? hideAxes : true}
        hideXAxis={true}
        colors={
          colors ||
          frequencies.map(([f]) => frequencyColor(f * base)).concat(["green"])
        }
        range={
          range || {
            x: [0, Math.PI],
            y: [-1, 1],
          }
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </>
  )
}
