export function* visit(getChildren, tree, index?, siblings?, parent?) {
  const children = getChildren(tree) || []
  const isRoot = parent === undefined;
  const isLeaf = !children?.length
  yield { node: tree, index, siblings, children, isBefore: true, isRoot, isLeaf, parent };
  for (let i = 0; i < children.length; ++i) {
    yield* visit(getChildren, children[i], i, children, tree)
  }
  yield { node: tree, index, siblings, children, isBefore: false, isRoot, isLeaf, parent };
}