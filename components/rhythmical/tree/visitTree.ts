// for an alternative implementation, check out visit (rhythmical-trees post)

export function visitTree<T>(
  tree: T,
  before: (node: T, index?: number, siblings?: T[], parent?: T) => any,
  after: (node: T, index?: number, siblings?: T[], parent?: T) => any,
  getChildren: (node: T) => T[],
  index?: number,
  siblings?: T[],
  parent?: T
) {
  before(tree, index, siblings, parent);
  getChildren(tree)?.forEach((child, i, a) => visitTree(child, before, after, getChildren, i, a, tree));
  after(tree, index, siblings, parent)
}

// used by rhythmEvents
// problems: read only
// TOTRY: implement rhythmEvents with editTree, without editing anything