// https://jrsinclair.com/articles/2019/functional-js-traversing-trees-with-recursive-reduce/
import { curry } from 'ramda';

export const Tree = {
  reduce: curry(function reduce(getChildren, reducerFn, init, node) {
    const acc = reducerFn(init, node);
    const children = getChildren(node);
    if (!children?.length) {
      return acc;
    }
    return children.reduce(Tree.reduce(getChildren, reducerFn), acc);
  }),
  map: curry(function map(getChildren, makeParent, mapFn, node, index = 0, siblings = []) {
    const newNode = mapFn(node, index, siblings);
    const children = getChildren(newNode);
    if (!children?.length) {
      return newNode;
    }
    return makeParent(newNode, children.map(Tree.map(getChildren, makeParent, mapFn)));
  }),
}
