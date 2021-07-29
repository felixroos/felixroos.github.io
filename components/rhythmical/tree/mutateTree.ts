// difference to visit = getChildren passes not only the node, but also state info
export function* mutateTree(getChildren, tree, index?, siblings?, parent?) {
  const state = { node: tree, index, siblings, parent, isRoot: parent === undefined };
  const children = getChildren(state) || []
  const isLeaf = !children?.length
  yield { ...state, children, isBefore: true, isLeaf };
  for (let i = 0; i < children.length; ++i) {
    yield* mutateTree(getChildren, children[i], i, children, tree)
  }
  // yield* children.map((child, i) => mutateTree(getChildren, child, mutateFn, i, children, tree));
  yield { ...state, children, isBefore: false, isLeaf };
}