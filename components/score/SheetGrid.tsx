import React, { useEffect, useState } from 'react';
import flatten from '../common/flatten';
import bestChordScales from '../graphs/bestChordScales';
import NestedGrid from '../graphs/NestedGrid';
import { mapNestedArray } from '../rhythmical/tree/mapNestedArray';
import scaleColor from '../sets/scaleColor';
import ChordSymbol from './ChordSymbol';
import scaleModes from '../sets/scaleModes';

export default function SheetGrid({ measures, rows, rawText, noColors, innerBorders, loop, showScales }: any) {
  const [scales, setScales] = useState([]);
  useEffect(() => {
    console.log('run bestChordScales');
    const _scales = !noColors
      ? bestChordScales(flatten(measures), scaleModes('major', 'harmonic minor', 'melodic minor'), loop)
      : [];
    setScales(_scales);
  }, [measures]);
  let i = 0;
  const coloredCells = mapNestedArray(measures, (node) => {
    if (Array.isArray(node)) {
      return node;
    }
    const backgroundColor = !noColors && scales ? scaleColor(scales[i]) : 'white';
    const label = showScales ? scales[i] : node;
    ++i;
    return (
      <div style={{ backgroundColor, minWidth: '100%', minHeight: '100%' }} title={label}>
        {rawText ? label : <ChordSymbol chord={node} fontSize={'20px'} />}
      </div>
    );
  });
  // cells={renderChordSymbols(measures, { fontSize: '20px' }, scales)}
  return (
    <NestedGrid
      rows={rows || [1, 1, 1, 1]}
      innerBorders={innerBorders ?? true}
      outerBorders={false}
      cells={coloredCells}
    />
  );
}
