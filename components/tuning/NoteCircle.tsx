import React from "react"
import Circle from "../common/Circle"
import { nearestPitch, frequencyColor } from "./tuning"

export default function NoteCircle(props) {
  const { frequency, cx, cy, radius } = props
  const note = nearestPitch(frequency)
  const color = frequencyColor(frequency)
  const text = {
    fontSize: radius * 0.6,
    textAnchor: "middle",
    pointerEvents: "none",
    style: { userSelect: "none" },
  }
  return (
    <Circle {...props} fill={color}>
      <text x={cx} y={cy + text.fontSize / 3} {...(text as any)}>
        {note}
      </text>
    </Circle>
  )
}
