// moved from util
// also check out visit for more features

export function* walk(getChildren, tree) {
  yield tree;
  const children = getChildren(tree) || []
  for (let i = 0; i < children.length; ++i) {
    yield* walk(getChildren, children[i])
  }
}
