import { Node, Parent } from 'unist';

// general AST functions
// http://localhost:3000/rhythm-queries

export interface TraverseState {
  index: number;
  // siblings: T[];
  isPost: boolean;
  [key: string]: any;
}

// used by query + morph

export interface EditAST<T extends Node | Parent> {
  (
    node: T,
    mapFn: (node: T, state?: Partial<TraverseState>) => T,
    traverseState: Partial<TraverseState> // need to add index: 0 for root node?
  ): T;
}

export const editAST: EditAST<Node | Parent> = (
  node,
  mapFn,
  traverseState: Partial<TraverseState> = {} // need to add index: 0 for root node?
) => {
  const edited = mapFn(node, { ...traverseState, isPost: false });
  if ('children' in edited) {
    edited.children = edited.children.map((child, index) =>
      editAST(child, mapFn, { ...traverseState, index, parent: edited, originalParent: node })
    );
  }
  return mapFn(edited, { ...traverseState, isPost: true });
};
