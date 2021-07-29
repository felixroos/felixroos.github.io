import { getRhythmChildren, makeRhythmParent, RhythmNode } from '../util';

export function transformRhythm<T>(
  //filter: (node: RhythmNode<T>, index: number, siblings: RhythmNode<T>[], parent?: RhythmNode<T>) => boolean,
  before: (node: RhythmNode<T>, index: number, siblings: RhythmNode<T>[], parent?: RhythmNode<T>) => RhythmNode<T>,
  after: (node: RhythmNode<T>, index: number, siblings: RhythmNode<T>[], parent?: RhythmNode<T>) => RhythmNode<T>,
  node: RhythmNode<T>,
  index?: number,
  siblings?: RhythmNode<T>[],
  parent?: RhythmNode<T>
) {
  //const matches = filter(node, index, siblings, parent);
  //if (matches) {
  node = before(node, index, siblings, parent);
  //}
  let children = getRhythmChildren(node);
  if (children) {
    children = children.map(
      (child, i, _siblings) => transformRhythm(/* filter, */ before, after, child, i, _siblings, node)
    );
    node = makeRhythmParent(node, children);
  }
  //return matches ? after(node, index, siblings, parent) : node;
  return node;
}
