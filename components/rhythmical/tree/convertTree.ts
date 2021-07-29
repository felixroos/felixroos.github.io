// like editTree, but with I, O generics
export function convertTree<I, O>(
  getChildren: (tree: O) => I[],
  makeParent: (tree: O, children: O[]) => O,
  before: (tree: I, index?: number, siblings?: I[], parent?: O) => O,
  after: (tree: O, index?: number, siblings?: I[], parent?: O) => O,
  tree: I,
  index?: number,
  siblings?: I[],
  parent?: O
): O {
  let output = before(tree, index, siblings, parent);
  let children = getChildren(output);
  if (children?.length) {
    const childrenOut = children.map((child, index, siblings) =>
      convertTree(getChildren, makeParent, before, after, child, index, siblings, output));
    output = makeParent(output, childrenOut);
  }
  return after ? after(output, index, siblings, parent) : output;
}
// TODO: use with
// - editRhythm
// - r2d3
// TOTRY: use T with state in it...
