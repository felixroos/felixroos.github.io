import React from "react"
import { scaleLinear } from "d3-scale"
import { select } from "d3-selection"
import { axisBottom, axisLeft } from "d3-axis"

export function FunctionPlotB({ f, width, margin, height, range }) {
  margin = margin || 40
  width = width || 400
  height = height || 300
  range = range || { x: [-1, 1], y: [-1, 1] }
  const line = [],
    x = scaleLinear()
      .domain(range.x)
      .range([margin, width - margin]),
    y = scaleLinear()
      .domain(range.y)
      .range([height - margin, margin])
  for (let i = margin + 1e-6; i < width - margin; i += 1) {
    const X = x.invert(i),
      Y = f(X),
      j = y(Y)
    line.push([i, j])
  }
  return (
    <svg width={width + 20} height={height + 20}>
      <g>
        <path d={`M${line.join("L")}`} stroke="steelblue" fill="none" />
        <g
          transform={`translate(${margin},0)`}
          ref={(g) => select(g).call(axisLeft(y))}
        />
        <g
          transform={`translate(0,${y(0)})`}
          ref={(g) => select(g).call(axisBottom(x))}
        />
      </g>
    </svg>
  )
}

export function FunctionPlotA({ f, width, margin, height, range }) {
  margin = margin || 40
  width = width || 400
  height = height || 300
  range = range || { x: [-1, 1], y: [-1, 1] }
  return (
    <svg
      ref={(el) => {
        const svg = select(el)
            .attr("width", width + 20)
            .attr("height", height + 20),
          x = scaleLinear()
            .domain(range.x)
            .range([margin, width - margin]),
          y = scaleLinear()
            .domain(range.y)
            .range([height - margin, margin]),
          g = svg.append("g"),
          line = []
        for (let i = margin + 1e-6; i < width - margin; i += 1) {
          const X = x.invert(i),
            Y = f(X),
            j = y(Y)
          line.push([i, j])
        }
        g.append("path")
          .attr("d", "M" + line.join("L"))
          .style("stroke", "steelblue")
          .style("fill", "none")
        g.append("g")
          .attr("transform", `translate(${margin},0)`)
          .call(axisLeft(y))
        g.append("g")
          .attr("transform", `translate(0,${y(0)})`)
          .call(axisBottom(x))
      }}
    ></svg>
  )
}
