export function editTree<T>(
  getChildren: (tree: T) => T[],
  makeParent: (tree: T, children: T[]) => T,
  before: (tree: T, index?: number, siblings?: T[], parent?: T) => T,
  after: (tree: T, index?: number, siblings?: T[], parent?: T) => T,
  tree: T,
  index?: number,
  siblings?: T[],
  parent?: T
) {
  tree = before(tree, index, siblings, parent);
  const children = getChildren(tree);
  if (children?.length) {
    tree = makeParent(
      tree,
      children.map((child, index, siblings) =>
        editTree(getChildren, makeParent, before, after, child, index, siblings, tree)
      )
    );
  }
  return after(tree, index, siblings, parent);
}
