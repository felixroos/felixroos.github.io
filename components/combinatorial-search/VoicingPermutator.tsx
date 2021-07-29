import {
  permutate,
  renderUp,
  flatTree,
  arrangePermutations,
  sortByMeanMidi
} from './pitchPermutation';
import React, { useMemo } from 'react';
import tinypiano from '../../instruments/tinypiano';
import PermutationTree from './PermutationTree';
import Player from '../rhythmical/components/Player';
import { renderRhythm } from '../rhythmical/rhythmical';
import { inherit } from '../rhythmical/features/inherit';

export default function VoicingPermutator({
  range,
  options,
  hidePlayer,
  height,
  scrollHeight,
  hasOctaves
}) {
  height = height || 200;
  hasOctaves = hasOctaves ?? false;
  const piano = useMemo(() => tinypiano.load(), []);
  const playNode = (hasOctaves = false) => ({ data: { path, isLeaf } }) => {
    const notes = hasOctaves ? path : renderUp(path, 3);
    notes.forEach(async (note) => (await piano).triggerAttackRelease(note, 4));
  };
  const tree = permutate(options);
  let chords = flatTree(tree);
  if (!hasOctaves) {
    chords = chords.reduce(arrangePermutations(range), []);
  } else {
    chords = chords.map((voicing) => ({ parallel: voicing }));
  }
  chords = chords.sort(sortByMeanMidi);
  return (
    <>
      <div style={{ height: scrollHeight || height + 20, overflow: 'auto' }}>
        <PermutationTree
          height={height}
          onClick={playNode(hasOctaves)}
          children={tree}
        />
      </div>
      {!hidePlayer && (
        <Player
          instruments={{ tinypiano }}
          fold={false}
          events={renderRhythm(
            {
              duration: chords.length * 2,
              sequential: chords
            },
            [inherit('color')]
          )}
        />
      )}
    </>
  );
}
