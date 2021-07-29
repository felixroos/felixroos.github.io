import { getRhythmChildren, makeRhythmParent, RhythmNode, toRhythmObject } from '../util';

export function rhythmAST<T>(rhythm: RhythmNode<T>) {
  const o = toRhythmObject(rhythm);
  const children = getRhythmChildren(rhythm);
  if (!children) {
    return o
  }
  return makeRhythmParent(o, children.map(child => rhythmAST(child)))
}

declare type AST<T> = {
  type: string,
  data: T,
  children?: AST<T>[],
  [key: string]: any
}

export function toAST<T>(
  getChildren: (node: T) => T[],
  makeNode: (data: T, type: string, children?: AST<T>[]) => AST<T>,
  tree: T,
): AST<T> {
  const children = getChildren(tree);
  let type;
  if (Array.isArray(tree)) {
    type = 'array';
  } else if (typeof tree === 'object') {
    type = 'object';
  } else {
    type = 'literal';
  }
  if (!children) {
    return makeNode(tree, type);
  }
  return makeNode(tree, type, children.map(child => toAST(getChildren, makeNode, child)));
}

export function fromAST<T>(makeParent: (node: T, children: T[]) => T, ast: AST<T>): T {
  if (!ast.children) {
    return ast.data
  }
  return makeParent(ast.data, ast.children.map(child => fromAST(makeParent, child)));
}

declare type TransformAST<T> = (ast: AST<T>) => AST<T>;

export function transformAST<T>(
  getChildren,
  makeNode,
  makeParent,
  transformation: TransformAST<T>,
  node: T
) {
  let ast = toAST<T>(
    getChildren,
    makeNode, node);
  ast = transformation(ast);
  return fromAST<T>(
    makeParent,
    ast
  );
}


const makeRhythmAST = (data, type, children) => ({
  data,
  type,
  ...(children ? { children } : {})
});

export function transformRhythmAST<T>(transformation: TransformAST<T>, node: T) {
  return transformAST(getRhythmChildren, makeRhythmAST, makeRhythmParent, transformation, node)
}