import React, { useRef } from "react"
import { frequencyColor } from "./tuning"
import { gcd } from "../common/gcd"
import FractionCircle from "../common/FractionCircle"
import useSynth from "../common/useSynth"

export function Lambdoma({
  radius,
  margin,
  cols,
  rows,
  base,
  filter,
  hideExtensions,
  hideLines,
  hideZeroes,
  min,
  max,
  clamp,
  angle,
  playOnHover,
  playWithTonic,
}: any) {
  const containerRef = useRef<any>()
  margin = margin !== undefined ? margin : radius * 0.2
  base = base || 440
  hideZeroes = hideZeroes === "undefined" ? false : hideZeroes
  playOnHover = playOnHover === "undefined" ? false : playOnHover
  playWithTonic = playWithTonic === "undefined" ? true : playWithTonic
  angle = ((typeof angle !== "number" ? 45 : angle) / 180) * Math.PI
  const { triggerAttackRelease } = useSynth({
    voices: 6,
    options: {
      volume: -16,
      oscillator: { type: "fmtriangle" },
      envelope: {
        attack: 0.05,
        decay: 2,
        sustain: 0,
        release: 0.1,
      },
    },
  })

  cols += 1
  rows += 1
  let size = {
    width: cols * (radius * 2 + margin),
    height: rows * (radius * 2 + margin),
  }
  if (angle) {
    const { width, height } = size
    const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
    size = {
      width: diagonal,
      height: diagonal,
    }
  }
  if (clamp) {
    min = 0.5
    /* min = 1 */
    max = 2
  }

  const grid: any = Array.from({ length: cols }).reduce(
    (flat: any[], _, col) =>
      flat.concat(
        Array.from({ length: rows })
          .map((_, row) =>
            hideZeroes
              ? [(col + 1) / (row + 1), col + 1, row + 1]
              : [col && row ? col / row : null, col, row]
          )
          .filter(([value, top, bottom]) => {
            /* if (hideZeroes && (top === rows || bottom === cols)) {
              // filter out last extra row
              return false
            } */
            if (!value) {
              return clamp ? top === bottom : true
            }
            if (hideExtensions && gcd(top, bottom) !== 1) {
              return false
            }
            if (typeof min === "number" && value < min) {
              return false
            }
            if (typeof max === "number" && value > max) {
              return false
            }
            if (typeof filter === "function" && !filter([value, top, bottom])) {
              return false
            }
            return true
          })
      ),
    []
  )

  const coordinates = (top, bottom) => {
    let { x, y } = {
      x: top * (radius * 2 + margin) + radius,
      y: bottom * (radius * 2 + margin) + radius,
    }
    if (angle) {
      const sin = Math.sin(angle)
      const cos = Math.cos(angle)
      return {
        x: x * cos - y * sin + size.width / 2,
        y: x * sin + y * cos,
      }
    }
    return { x, y }
  }

  const lineTo = (col, row) => {
    /* const { x: x1, y: y1 } = coordinates(cols/2, rows/2) */
    const { x: x1, y: y1 } = coordinates(0, 0)
    const { x: x2, y: y2 } = coordinates(col, row)
    return {
      x1,
      x2,
      y1,
      y2,
      stroke: frequencyColor((col / row) * base),
      strokeWidth: 2,
    }
  }

  const maxWidth = 600
  const maxHeight = 600
  const diff = size.width - maxWidth
  if (diff > 0 && containerRef.current && angle !== 0) {
    containerRef.current.scrollLeft = diff / 2
  }

  return (
    <>
      <div
        style={{
          overflow: "auto",
          maxHeight,
          width: maxWidth,
          textAlign: "center",
        }}
        ref={containerRef}
      >
        <svg {...size} style={{ maxWidth: size.width }}>
          {!hideLines &&
            // filters shorter lines behind longer lines in same direction
            // seems faster without
            grid
              .filter(
                ([value, top, bottom], index) =>
                  !grid.find(
                    ([_value, _top, _bottom], _index) =>
                      _index > index && _value === value
                  )
              )
              .map(([value, top, bottom]) => (
                <g key={`${top}-${bottom}`}>
                  <line {...lineTo(top, bottom)} />
                </g>
              ))}

          {grid.map(([value, top, bottom]) => {
            const { x, y } = coordinates(top, bottom)
            return (
              <g key={`${top}-${bottom}`}>
                <FractionCircle
                  border={1}
                  base={base}
                  top={top}
                  bottom={bottom}
                  radius={radius}
                  cx={x}
                  cy={y}
                  onTrigger={(pitches) => triggerAttackRelease(pitches, 1)}
                  playOnHover={playOnHover}
                  playWithTonic={playWithTonic}
                />
              </g>
            )
          })}
        </svg>
      </div>
    </>
  )
}
