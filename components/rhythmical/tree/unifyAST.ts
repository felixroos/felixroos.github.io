import { Node, Parent } from 'unist';

export const unifyAST = <From, To extends Node | Parent>(
  getNode: (node: From) => To & { children?: From[] },
  data: From
): To => {
  const node = getNode(data);
  if ('children' in node) {
    return {
      ...node,
      children: node.children.map((child) => unifyAST(getNode, child)),
    };
  }
  return node;
};
