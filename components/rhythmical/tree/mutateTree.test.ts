import { mutateTree } from './mutateTree'

test('mutateTree', () => {
  const mutator = mutateTree(node => Array.isArray(node) && node, ['C^7', ['Dm7', 'G7'], 'C^7'], (node) => {
    if (node === 'C^7') {
      return ['C', 'E', 'G', 'B'];
    }
    return node;
  });
  /* for (let { node } of mutator) {
    console.log(node);
  } */
})