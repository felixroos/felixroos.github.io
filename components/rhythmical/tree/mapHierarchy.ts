export declare type ChildrenGetter<S> = (hierarchy: S) => S[];
export declare type ParentFactory<S> = (hierarchy: S, children: S[]) => S;
export declare type NodeMapFn<S> = (hierarchy: S, index: number, siblings?: S[]) => S;
export declare type NodeMapFny<S> = (hierarchy: S, index: number, siblings?: S[]) => any;

export function mapHierarchy<S>(
  getChildren: ChildrenGetter<S>,
  makeParent: ParentFactory<S>,
  mapFn: NodeMapFn<S>,
  hierarchy: S,
  index?: number,
  siblings?: S[]
): any {
  hierarchy = mapFn(hierarchy, index, siblings);
  const children = getChildren(hierarchy);
  if (!children?.length) {
    return hierarchy;
  }
  return makeParent(
    hierarchy,
    children.map((...args) => mapHierarchy(getChildren, makeParent, mapFn, ...args))
  );
}

/* used by

- addColors (unused)

*/