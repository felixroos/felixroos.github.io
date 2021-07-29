import React from "react"

export function Slider({ value, min, max, onChange }) {
  return (
    <input
      type="range"
      min={min || 0}
      max={max || 100}
      value={value + ""}
      onChange={(e) => onChange && onChange(parseInt(e.target.value))}
    />
  )
}
