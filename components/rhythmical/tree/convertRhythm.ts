import { getRhythmChildren, makeRhythmParent, RhythmNode } from '../util';
import { convertTree } from './convertTree';

export function convertRhythm<T>(rhythm: RhythmNode<T>,
  before: (tree: RhythmNode<T>, index?: number, siblings?: RhythmNode<T>[], parent?: RhythmNode<T>) => RhythmNode<T>,
  after?: (tree: RhythmNode<T>, index?: number, siblings?: RhythmNode<T>[], parent?: RhythmNode<T>) => RhythmNode<T>
) {
  return convertTree<RhythmNode<T>, RhythmNode<T>>(
    getRhythmChildren,
    makeRhythmParent,
    before,
    after,
    rhythm
  );
}