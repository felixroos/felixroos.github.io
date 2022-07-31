/* import { makeZipper, zip } from 'zippa';
import { pathTimeDuration, makeRhythmParent, rhythmFraction, getRhythmChildren, editLeafValue } from '../util';
import { Path, rhythmEvents } from './hierarchy';
import pipe from 'ramda/src/pipe';
import until from 'ramda/src/until';
import curry from 'ramda/src/curry';

const isBranch = (node) => !!getRhythmChildren(node);

export const RhythmZipper = makeZipper(isBranch, getRhythmChildren, makeRhythmParent);

const { isEnd, isLeaf, next, root, up, down, isTop } = zip;

const walkZipper = curry((fn, zipper) => pipe(
  until(isEnd, pipe(fn, next)),
  root
)(zipper));

export const walkZipperLeafs = curry((fn, zipper) =>
  walkZipper(pipe(until(isLeaf, next), fn), zipper),
);

export const walkRhythm = curry((fn, rhythm) =>
  walkZipper(fn, RhythmZipper(rhythm)).value()
);

export const walkRhythmLeafs = curry((fn, rhythm) =>
  walkZipperLeafs(fn, RhythmZipper(rhythm)).value()
);


// see transpose for usage
export const editLeaf = fn => pipe(editLeafValue, zip.edit)(fn)

// RENDER RHYTHM

// calculates fractional path for given ancestors
export function rhythmPath(node): Path[] {
  const path = [];
  until(isTop, pipe((n) => {
    const { getChildren } = n.meta;
    const parent = n.up()?.value();
    const fraction = rhythmFraction(
      n.value(),
      n.path.left.length,
      getChildren(parent),
      parent)
    path.unshift(fraction);
    return n;
  }, up))(node)
  return path;
}

// turns rhythm json to flat events with time & duration
export function renderEvents(rhythm) {
  const tree = RhythmZipper.from(rhythm);
  const { getChildren } = tree.meta;
  const rootDuration = tree.value()?.duration || getChildren(rhythm)?.length || 1;
  const events = [];
  walkZipperLeafs((node) => {
    // TBD inherit path down, not from each leaf up again => redundant calculations
    const path: Path[] = rhythmPath(node);
    events.push({
      ...(typeof node.value() === 'object' ? node.value() : { value: node.value() }),
      path,
      ...pathTimeDuration(path, rootDuration)
    });
    return node;
  }, tree);
  return events;
}
 */
export {};
