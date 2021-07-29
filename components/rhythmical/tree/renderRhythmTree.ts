import { getRhythmChildren, pathTimeDuration, rhythmFraction, toRhythmObject } from '../util';
import { mutateTree } from './mutateTree';

export default function renderRhythmTree(rhythm, mapFn?) {
  const rhythmDuration = (node) => toRhythmObject(node).duration || 1;
  const totalDuration = rhythmDuration(rhythm);
  const mutateRhythm = (r) => mutateTree(editChildren(mapFn), r); // just some curry
  const path = [];
  const events = [];
  for (let { node, index, isBefore, isRoot, isLeaf, siblings, parent } of mutateRhythm(rhythm)) {
    if (!isRoot && isBefore) {
      path.push(rhythmFraction(node, index, siblings, parent));
      isLeaf && events.push({ ...toRhythmObject(node), ...pathTimeDuration(path, totalDuration) });
    } else if (!isRoot) {
      path.pop();
    }
  }
  return events;
}

const editChildren = (mapFn?) => (state) => {
  const children = getRhythmChildren(state.node);
  if (!mapFn) {
    return children;
  }
  return mapFn({ ...state, children });
}