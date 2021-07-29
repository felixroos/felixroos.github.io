import { cents, frequencyColor } from "./tuning"
import Fraction from "fraction.js"
import { Link, NodeIdentifier, Node } from "../common/ConnectedCircle"
import React from "react"
import { useHover, useGesture } from "react-use-gesture"

declare type ViewType = "cents" | "ratios"

declare type IntervalLink = Link<{ ratio: number; frequency: number }>

export default function IntervalSet({
  links,
  view,
  base,
  width,
  height,
  onClick,
  onHover,
  focus,
}: {
  links?: IntervalLink[]
  view?: ViewType
  base?: number
  width?: number
  height?: number
  onClick?: (link: IntervalLink) => void
  onHover?: (link: IntervalLink) => void
  focus?: IntervalLink
}) {
  width = width || 350
  height = height || 250
  base = base || 440
  links = links || []
  view = view || "ratios"
  const size = width

  const hover = useHover(
    ({ args: [link], active }) => onHover && onHover(active ? link : undefined)
  )
  return (
    <svg width={width} height={height}>
      {links
        //.sort((a, b) => a.frequency - b.frequency)
        .map((link, i) => {
          const { value } = link
          const { ratio, frequency } = value
          const bar = height / links.length
          const length = (cents(ratio) / 1200) * size
          const inverse = ((1200 - cents(ratio)) / 1200) * size
          const padding = 2

          function label(r: number, complement = false) {
            switch (view) {
              case "cents":
                return Math.abs(
                  Math.round(cents(ratio) - (complement ? 1200 : 0))
                )
              default:
                return new Fraction(complement ? 2 / r : r).toFraction()
            }
          }

          return (
            <React.Fragment key={i}>
              <rect
                x={0}
                y={i * bar}
                width={length}
                height={bar}
                stroke="gray"
                strokeWidth={1}
                fill={
                  isLinkActive(link, focus)
                    ? frequencyColor(ratio * base)
                    : "lightgray"
                }
                onClick={() => onClick && onClick(link)}
                {...hover(link)}
              />
              <rect
                x={size - inverse}
                y={i * bar}
                width={inverse}
                height={bar}
                stroke="gray"
                strokeWidth={1}
                fill={
                  isLinkActive(
                    { source: link.target, target: link.source },
                    focus
                  )
                    ? frequencyColor((1 / ratio) * base)
                    : "lightgray"
                }
                onClick={() =>
                  onClick &&
                  onClick({ source: link.target, target: link.source })
                }
                {...hover({ source: link.target, target: link.source })}
              />
              <text
                style={{ userSelect: "none", pointerEvents: "none" }}
                x={padding}
                y={(i + 1) * bar - bar / 3}
              >
                {label(ratio)}
              </text>
              <text
                style={{ userSelect: "none", pointerEvents: "none" }}
                textAnchor="end"
                x={size - padding}
                y={(i + 1) * bar - bar / 3}
              >
                ({label(ratio, true)})
              </text>
            </React.Fragment>
          )
        })}
    </svg>
  )
}

export function getLink(source, target, nodes, base, focus?: IntervalLink) {
  const factor = (v) => Math.ceil(v / (nodes.length - 1))
  const ratio =
    (factor(target) * nodes[target % nodes.length].ratio) /
    nodes[source % nodes.length].ratio /* * factor(source) */
  target = target % nodes.length
  source = source % nodes.length
  const frequency = ratio * base

  let color = "lightgray"
  if (typeof focus === "undefined") {
    color = frequencyColor(frequency)
  } else if (focus.source === source && focus.target === target) {
    color = frequencyColor(frequency)
  } else if (focus.source === target && focus.target === source) {
    color = frequencyColor((1 / ratio) * base)
  }
  return {
    source,
    target,
    value: {
      ratio,
      frequency,
    },
    stroke: color,
    strokeWidth: 10,
  }
}

export function getLinks(
  nodes: Node[],
  interval: number,
  base: number,
  focus?: IntervalLink
) {
  return nodes.map(({ id }, i) =>
    //getLink(i + interval, i + nodes.length, nodes, base, focus)
    getLink(i, i + interval, nodes, base, focus)
  )
  /* .concat(
      nodes.map(({ id }, i) => getLink(i, i + interval, nodes, base, focus))
    ) */
}

export function isNodeActive(id: NodeIdentifier, focus: IntervalLink) {
  return (
    typeof focus === "undefined" || [focus.target, focus.source].includes(id)
  )
}

export function isLinkActive(link: IntervalLink, focus: IntervalLink) {
  return (
    !focus ||
    (link && link.source === focus.source && link.target === focus.target)
  )
}

export function getNodes(
  ratios: number[],
  base: number,
  view?: ViewType,
  focus?: IntervalLink
): Node[] {
  return ratios
    .map((ratio) => ({
      ratio,
      value: cents(ratio) / 1200,
      frequency: ratio * base,
    }))
    .reduce(
      (nodes, { value, ratio, frequency }, i) =>
        nodes.concat([
          {
            id: i,
            label:
              view === "cents"
                ? Math.round(cents(ratio)) + ""
                : new Fraction(ratio).toFraction(false),
            value,
            ratio,
            fill: isNodeActive(i, focus)
              ? frequencyColor(frequency)
              : "lightgray",
          },
        ]),
      []
    )
}
