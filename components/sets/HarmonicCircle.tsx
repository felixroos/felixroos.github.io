import React from 'react';
import ConnectedCircle from '../common/ConnectedCircle';
import getNodes from './getNodes';

export default function HarmonicCircle({ pitches, tonic, relative, ...props }) {
  // const notes = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
  const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  return <ConnectedCircle margin={3} nodes={getNodes(notes, pitches, tonic, relative)} r={110} {...props} />;
}
