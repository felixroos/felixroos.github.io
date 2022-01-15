import { Note } from '@tonaljs/tonal';
import React from 'react';
import ConnectedCircle from '../common/ConnectedCircle';
import { cents, frequencyColor, getRatioLabel } from './tuning';

function RatioCircle(props) {
  const { ratios = [], onTrigger, unit } = props;
  const root = 'C4';
  const base = Note.freq(root);
  return (
    <ConnectedCircle
      r={100}
      nodeRadius={20}
      nodes={ratios.map((ratio, id) => ({
        id: '' + id,
        label: getRatioLabel(ratio, unit, root),
        value: cents(ratio) / 1200,
        ratio,
        distance: 140,
        fill: frequencyColor(base * ratio),
      }))}
      links={[]}
      onClick={({ node }) => {
        if (node) {
          onTrigger?.(node.ratio * base, 1);
        }
      }}
    />
  );
}

export default RatioCircle;
