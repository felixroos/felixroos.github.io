import { getRhythmChildren, makeRhythmParent, RhythmNode, RhythmObject, toRhythmObject } from '../util';
import { Node, Parent } from 'unist'
import { curry } from 'ramda';

declare interface UnifyProps {
  getChildren?: (node: any) => any[],
  getType?: (node: any) => string,
  map?: (node: any) => any,
  excludeData?: boolean
} // TODO: find out how to type this...

// like astify, but using props
export const unify = curry((props, data) => {
  const {
    getChildren = (node) => node.children,
    getType = (node) => node.type,
    map = ({ type, data, children }) => ({ type, data, ...(children ? { children } : {}) }),
  } = props;
  const type = getType(data);
  const children = getChildren(data);
  if (!children) {
    return map({ type, data });
  }
  return map({
    type,
    data,
    children: children.map(unify(props)),
  });
});

export declare interface ASTNode<T> {
  type: string;
  children?: ASTNode<T>[];
  data?: T;
  [property: string]: any
};

// more general version of toAST
export function astify<T>(
  getChildren: (node: T) => T[],
  getType: (node: T) => string,
  tree: T,
  excludeData? // if true, no data will be set
): ASTNode<T> {
  const children = getChildren(tree);
  const type = getType(tree);
  if (!children) {
    return { type, data: tree };
  }
  return {
    type,
    ...(excludeData ? {} : { data: tree }),
    children: children.map((child) => astify(getChildren, getType, child, excludeData)),
  };
}

export function astifyRhythm(rhythm) {
  return astify(
    getRhythmChildren,
    getRhythmType, rhythm)
}

function getRhythmType(node) {
  if (typeof node !== 'object') {
    return 'leaf';
  }
  if (Array.isArray(node)) {
    return 'array';
  }
  if (node.sequential) {
    return 'sequential';
  }
  if (node.parallel) {
    return 'parallel';
  }
  return 'string';
}

export declare type ASTVisitor<T> = (node: ASTNode<T>) => void;

export function visitAST<T>(node: ASTNode<T>, visitor: ASTVisitor<T>): void {
  visitor(node);
  if (node.children) {
    node.children.forEach((child) => visitAST(child, visitor));
  }
}

export declare type MapFn<T> = (node: T) => T;

export function mapAST<T>(node: ASTNode<T>, mapFn: MapFn<ASTNode<T>>): ASTNode<T> {
  const edited = mapFn(node);
  if (edited.children) {
    edited.children = edited.children.map((child) => mapAST(child, mapFn));
  }
  return edited;
}

export function cleanRhythmAST<T>(node: ASTNode<RhythmNode<T>>): ASTNode<RhythmNode<T>> {
  const { type, data, ...restOfNode } = node;
  if (type === 'array') {
    return { type, ...restOfNode }; // without data
  }
  if (type === 'leaf') {
    return node; // with data
  }
  const { sequential, parallel, ...withoutChildProperties } = node.data as RhythmObject<T>;
  return { type, ...withoutChildProperties, ...restOfNode }; // without data
}

export function toRhythmAST(rhythm) {
  const ast = astify(
    getRhythmChildren,
    getRhythmType, rhythm)
  return mapAST(ast, cleanRhythmAST);
}

export function resolveMultiplication(node: ASTNode<RhythmNode<string>>): ASTNode<RhythmNode<string>> {
  if (node.type !== 'leaf') { //  || !node.data.includes('*')
    return node;
  }
  const [data, times] = (node.data as string).split('*');
  const length = parseInt(times);
  if (!length) { // invalid length
    return { type: 'leaf', data };
  }
  const children = Array.from({ length }, (_, i) => ({ type: 'leaf', data }));
  console.log('times', times, data, children);
  return {
    type: 'sequential',
    children
  }
}



// OLD

export function rhythmAST<T>(rhythm: RhythmNode<T>) {
  const o = toRhythmObject(rhythm);
  const children = getRhythmChildren(rhythm);
  if (!children) {
    return o;
  }
  return makeRhythmParent(
    o,
    children.map((child) => rhythmAST(child))
  );
}

declare type AST<T> = {
  type: string;
  data: T;
  children?: AST<T>[];
  [key: string]: any;
};

export function toAST<T>(
  getChildren: (node: T) => T[],
  makeNode: (data: T, type: string, children?: AST<T>[]) => AST<T>,
  tree: T
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
  return makeNode(
    tree,
    type,
    children.map((child) => toAST(getChildren, makeNode, child))
  );
}

export function fromAST<T>(makeParent: (node: T, children: T[]) => T, ast: AST<T>): T {
  if (!ast.children) {
    return ast.data;
  }
  return makeParent(
    ast.data,
    ast.children.map((child) => fromAST(makeParent, child))
  );
}

declare type TransformAST<T> = (ast: AST<T>) => AST<T>;

export function transformAST<T>(getChildren, makeNode, makeParent, transformation: TransformAST<T>, node: T) {
  let ast = toAST<T>(getChildren, makeNode, node);
  ast = transformation(ast);
  return fromAST<T>(makeParent, ast);
}

const makeRhythmAST = (data, type, children) => ({
  data,
  type,
  ...(children ? { children } : {}),
});

export function transformRhythmAST<T>(transformation: TransformAST<T>, node: T) {
  return transformAST(getRhythmChildren, makeRhythmAST, makeRhythmParent, transformation, node);
}
