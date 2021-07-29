import { NestedArray } from '../helpers/arrays';
import { mapHierarchy, NodeMapFny } from './mapHierarchy';

export function mapNestedArray<S>(array: NestedArray<S>, mapFn: NodeMapFny<S | NestedArray<S>>) {
  return mapHierarchy<S | NestedArray<S>>(
    (node) => (Array.isArray(node) ? node : undefined),
    (node, children) => children || node,
    mapFn,
    array
  );
}
