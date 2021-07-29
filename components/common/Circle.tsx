import React from "react"

export default function Circle(props: any) {
  let { radius, cx, cy, border, strokeWidth, stroke, fill, onClick } = props
  border = typeof border === "number" ? border : 1
  strokeWidth =
    typeof strokeWidth === "number" ? strokeWidth : (radius / 16) * border
  const circle = {
    r: (radius || 30) - strokeWidth / 2,
    cx: typeof cx === "number" ? cx : radius,
    cy: typeof cy === "number" ? cy : radius,
    stroke: stroke || "black",
    strokeWidth,
    fill: fill || "white",
    onClick,
  }
  return (
    <>
      <circle {...circle} />
      {props.children}
    </>
  )
}

export function circlePosition(fraction, radius): [number, number] {
  return [
    Math.round(radius + Math.sin(fraction * Math.PI * 2) * radius),
    Math.round(radius - Math.cos(fraction * Math.PI * 2) * radius),
  ]
}
