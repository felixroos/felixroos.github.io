import { Parent, Node } from 'unist';
import Pattern from 'tidal.pegjs/dist/pattern.js';
// import { unifyAST } from '../rhythmical/tree/unifyAST';
import { query } from './query';

// renders events for one cycle of a pattern, starting at time n
export function queryPattern(pattern: string, n = 0, durationEvents = false) {
  const ast = unifyPattern(pattern); // generate unified AST from pattern string
  return query(ast, n, durationEvents);
}

// type renaming to be the same as rhythmical (might be renamed in the future)
const rename = {
  string: 'leaf',
  group: 'sequential',
  layers: 'parallel',
};

// convert tidal.pegjs
export const unifyPatternData = (patternData, shouldRename = false) => {
  return unifyAST<any, Node | Parent>((node) => {
    const { type, value, values, left, right, ...data } = node;
    let children;
    if (values) {
      children = values;
    } else if (value?.type) {
      // some types have a single object as value, which is like a single child
      children = [value];
    } else if (left && right) {
      // polymeter
      children = [left, right];
    }
    return {
      type: shouldRename ? rename[type] || type : type,
      ...data,
      ...(children ? { children } : { value }),
    };
  }, patternData);
};

export const unifiedPattern = (pattern: string) => unifyPatternData(Pattern(pattern).__data);
export const unifyPattern = (pattern: string, rename = true) => unifyPatternData(Pattern(pattern).__data, rename); // with rename

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
