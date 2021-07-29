import { getRhythmChildren, makeRhythmParent, RhythmNode } from '../util';

declare type MapRhythmFn<T> = (rhythm: RhythmNode<T>, state?: any) => [RhythmNode<T>, any];
export function mapRhythm<T>(mapFn: MapRhythmFn<T>, rhythm: RhythmNode<T>, state?: any) {
  [rhythm, state] = mapFn(rhythm, state);
  const children = getRhythmChildren(rhythm);
  if (!children) {
    return rhythm;
  }
  return makeRhythmParent(rhythm, children.map(child => mapRhythm(mapFn, child, state)))
}

// other functions that are able to edit a hierarchy:
/*

- mapHierarchy
- 

*/