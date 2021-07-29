import { walk } from './walk';

test('walk', () => {
  const nestedWalker = (tree) => walk((node) => Array.isArray(node) && node, tree);

  const tree = ['A', ['B', 'C'], 'D'];

  const walker = nestedWalker(tree);

  expect(walker.next().value).toEqual(['A', ['B', 'C'], 'D']);
  expect(walker.next().value).toEqual('A');
  expect(walker.next().value).toEqual(['B', 'C']);
  expect(walker.next().value).toEqual('B');
  expect(walker.next().value).toEqual('C');
  expect(walker.next().value).toEqual('D');
  expect(walker.next().value).toEqual(undefined);

  for (let node of nestedWalker(tree)) {
    console.log(node);
  }

})

test('walk rhythm', () => {
  function getRhythmChildren(node) {
    return Array.isArray(node) ? node : node?.parallel || node?.sequential;
  }
  const rhythmWalker = (tree) => walk(getRhythmChildren, tree);

  const rhythm = {
    duration: 4,
    sequential: [
      [{ value: 'C3', duration: 3 }, 'D3'],
      ['E3', { value: 'D3', duration: 2 }, 'B2']
    ]
  }

  for (let node of rhythmWalker(rhythm)) {
    console.log(node);
  }
})

