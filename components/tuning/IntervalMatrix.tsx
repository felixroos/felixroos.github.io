import Fraction from 'fraction.js';
import { equivalence, frequencyColor, tenneyHeight } from './tuning';
import { InlineMath } from 'react-katex';
import { max } from 'd3-array';
import { interpolateBlues } from 'd3-scale-chromatic';
import React, { useEffect, useMemo } from 'react';
import Circle from '../../lib/ony/Circle';
import { Button, ButtonGroup } from '@material-ui/core';

const transpose = (a) => a[0].map((_, c) => a.map((r) => r[c]));
const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;

function IntervalMatrix(props) {
  const { ratios, colorizeBy: colorizeByProp = 'frequency', sortByProp = 'interval', showSettings = true } = props;
  const [colorizeBy, setColorizeBy] = React.useState(colorizeByProp);
  const [sortBy, setSortBy] = React.useState(sortByProp);
  useEffect(() => {
    setColorizeBy(colorizeByProp);
  }, [colorizeByProp]);
  const { maxTenneyHeight, rows, intervalCounts, sortedByInterval } = useMemo(() => {
    const reduced = ratios.map((r) => equivalence(r)).sort((a, b) => a - b);
    let rows = reduced.map(
      (a) => reduced.map((b) => b / a).map((r) => equivalence(r))
      // .map((r) => round(r, 8))
    );
    const tenneyHeights = rows.flat().map((ratio) => {
      const f = new Fraction(ratio);
      return tenneyHeight(f.n, f.d);
    });
    const sortedByInterval = rows.map((row, i) => Circle(row).rotate(i).items /* .slice(1) */);
    // const cols = sortedByInterval.map((_, i) => sortedByInterval[i][i]);
    const intervalCounts = transpose(sortedByInterval)
      // .map((col) => col.map((cell) => round(cell, 8)))
      .map((col) => col.filter((cell, i, cells) => cells.indexOf(cell) === i).length);
    return {
      maxTenneyHeight: max(tenneyHeights),
      rows,
      sortedByInterval,
      intervalCounts,
      steps: rows[0].length,
    };
  }, [ratios]);
  const tenneyColor = (r) => {
    const { n, d } = new Fraction(r);
    return interpolateBlues(tenneyHeight(n, d) / maxTenneyHeight);
  };
  const colorizeOptions = ['frequency', 'tenney'];
  const sortByOptions = ['interval', 'steps'];
  const matrixRows = sortBy === 'interval' ? sortedByInterval : rows;
  return (
    <>
      {showSettings && (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <ButtonGroup color="primary">
            {colorizeOptions.map((option) => (
              <Button
                key={option}
                variant={colorizeBy === option ? 'contained' : 'outlined'}
                onClick={() => setColorizeBy(option)}
              >
                {option.toUpperCase()}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup color="primary">
            {sortByOptions.map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? 'contained' : 'outlined'}
                onClick={() => setSortBy(option)}
              >
                {option.toUpperCase()}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th></th>
            {matrixRows[0].map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrixRows.map((row, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              {row.map((ratio, j) => {
                const f = new Fraction(ratio);
                let backgroundColor;
                if (colorizeBy === 'frequency') {
                  backgroundColor = frequencyColor(440 * ratio);
                } else if (colorizeBy === 'tenney') {
                  backgroundColor = tenneyColor(ratio);
                }
                return (
                  <td
                    key={j}
                    style={{
                      // backgroundColor: frequencyColor(440 * ratio),
                      backgroundColor,
                      color: 'black',
                      padding: '2px',
                      textAlign: 'center',
                    }}
                  >
                    <InlineMath>{`\\frac{${f.n}}{${f.d}}`}</InlineMath>
                  </td>
                );
              })}
            </tr>
          ))}
          {sortBy === 'interval' && (
            <tr>
              <td></td>
              {rows[0].map((_, i) => (
                <th key={i}>{intervalCounts[i]}GP</th>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
export default IntervalMatrix;
