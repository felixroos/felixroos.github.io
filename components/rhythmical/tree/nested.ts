function nested(getChildren, fn) {
  return (node, index, siblings, parent) => {
    const state = {
      node,
      index,
      siblings,
      parent,
      isRoot: parent === undefined,
    };
    node = fn({ ...state, isBefore: true }); // mutate before
    const children = getChildren(node);
    if (children?.length) {
      return fn({
        ...state,
        isBefore: false,
        children: children.map((c, i, s) => nested(getChildren, fn)(c, i, s, node)),
      });
    }
    return fn({ ...state, isBefore: false }); // mutate after
  };
}

function nestedArray(fn, node?) {
  fn = nested((node) => (Array.isArray(node) ? node : undefined), fn);
  if (node) {
    // "curry"
    return fn(node);
  }
  return fn;
}

function exclamate(state) {
  const { node, isBefore, children } = state;
  if (isBefore) {
    return node;
  }
  if (children) {
    return children; // make parent
  }
  return node + '!'; // modify leaf
}

const edited2 = nestedArray(exclamate, ['a', ['b', 'c']]);
console.log('edited2', edited2);

function multiply({ node, isBefore, children }) {
  if (isBefore) {
    return !Array.isArray(node)
      ? node
      : node.reduce((acc, child) => {
          if (typeof child === 'string') {
            const [value, length = '1'] = child.split('*');
            return acc.concat(Array(parseInt(length) || 1).fill(value));
          }
          return acc.concat([child]);
        }, []);
  }
  if (children) {
    return children; // make parent
  }
  return node; // modify leaf
}

const editNestedArray = (node) => ({
  map: (fn) => editNestedArray(nestedArray(fn, [node])[0]),
  get: () => node,
});

const edited3 = nestedArray(multiply, ['a*2', ['b', 'c']]).map(nestedArray(exclamate));
console.log('edited3', edited3);

const edited4 = editNestedArray(['a*2', ['b', 'c']])
  .map(multiply)
  .map(exclamate)
  .get();
console.log('edited4', edited4);
