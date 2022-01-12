// TODO:
// add zoom https://observablehq.com/@d3/zoomable-scatterplot
import React from 'react';
import { scaleLinear, scaleLog } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { cs } from 'date-fns/locale';

export function PlotPath({ f }) {}

declare type Vec2 = [number, number];
declare type Path2 = Vec2[];

export const defaultPlotColors = ['lightsalmon', 'lightseagreen', 'indianred', 'darkmagenta', 'cornflowerblue', 'aqua'];

export function Plot({
  strokeWidth,
  functions,
  width,
  height,
  range,
  colors,
  logX,
  logY,
  grid,
  onHover,
  onMouseEnter,
  onMouseLeave,
  onClick,
  margin,
  hideAxes,
  hideXAxis,
  hideYAxis,
  onlySVG = false,
}: any) {
  margin = margin || { top: 20, right: 30, bottom: 30, left: 50 };
  width = width || 500;
  height = height || 300;
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  strokeWidth = strokeWidth || 1;
  colors = colors || defaultPlotColors;
  functions = functions || [];
  range = range || { x: [-4, 4], y: [-4, 4] };

  const xScale = logX ? scaleLog().base(logX || 10) : scaleLinear();
  const yScale = logY ? scaleLog().base(logY || 10) : scaleLinear();

  const x = xScale.domain(range.x).range([margin.left, width - margin.right]),
    y = yScale.domain(range.y).range([height - margin.top, margin.bottom]);

  const plots = functions.map((f) => {
    const lines: Path2[] = [[]];
    for (let i: number = margin.left + 1e-6; i < width - margin.right; i += 1) {
      const X = x.invert(i),
        Y = f(X);
      if (typeof Y === 'number') {
        const j: number = y(Y);
        // TODO find out if differentiable => add new line if not
        if (X >= range.x[0] && X <= range.x[1] && Y >= range.y[0] && Y <= range.y[1]) {
          lines[0].unshift([i, j]);
        }
      }
    }
    return lines;
  });
  const svg = (
    <svg width={width} height={height} onClick={(e) => onClick && onClick(e)}>
      {!hideAxes && (
        <>
          {!hideXAxis && (
            <g
              className="x-axis plot-axis"
              ref={(g) =>
                select(g)
                  /* .attr("transform", `translate(0,${y(0)})`) */
                  .attr('transform', `translate(0,${height - margin.top})`)
                  .call(axisBottom(x).ticks(width / 50))
              }
            />
          )}
          {!hideYAxis && (
            <g
              className="y-axis plot-axis"
              ref={(g) =>
                select(g)
                  /* .attr("transform", `translate(${x(0)},0)`) */
                  .attr('transform', `translate(${margin.left},0)`)
                  .call(axisLeft(y).ticks(height / 50))
              }
            />
          )}
        </>
      )}
      {grid && (
        <>
          {grid.x && (
            <g
              className="grid"
              ref={(g) =>
                select(g)
                  .attr('transform', `translate(0, ${y(range.y[1])})`)
                  .call(
                    axisBottom(x)
                      .ticks(grid.x)
                      .tickSize(innerHeight)
                      .tickFormat(() => '')
                  )
              }
            />
          )}
          {grid.y && (
            <g
              className="grid"
              ref={(g) =>
                select(g)
                  .attr('transform', `translate(${x(range.x[0])}, 0)`)
                  .call(
                    axisLeft(y)
                      .ticks(grid.y)
                      .tickSize(-innerWidth)
                      .tickFormat(() => '')
                  )
              }
            />
          )}
        </>
      )}
      <g>
        {plots.map((lines, i) =>
          lines.map((line, j) => (
            <path
              onMouseEnter={() => onMouseEnter && onMouseEnter(i)}
              onMouseLeave={() => onMouseLeave && onMouseLeave(i)}
              key={i + '-' + j}
              d={'M' + line.join('L')}
              stroke={colors[i % colors.length] || 'black'}
              strokeWidth={strokeWidth}
              fill="none"
            />
          ))
        )}
        {/* <g transform={`translate(${m},0)`}></g> axisLeft(y) */}
        {/* <g transform={`translate(0,${y(0)})`}></g> axisBottom(x) */}
      </g>
    </svg>
  );
  if (onlySVG) {
    return svg;
  }
  return <div className="max-w-full overflow-auto">{svg}</div>;
}

// https://stackoverflow.com/a/56029853/5470719
