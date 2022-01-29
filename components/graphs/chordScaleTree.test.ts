import scaleModes from '../sets/scaleModes'
import chordScaleTree, { buildTree, buildTreeLevel } from './chordScaleTree';

test('chordScaleTree', () => {
  const { nodes, edges } = chordScaleTree(['Dm7', 'G7', 'C^7'], scaleModes('major'));
  expect(nodes.map(({ label, id }) => [id, label])).toEqual([
  ]);

  expect(edges.map(({ source, target }) => [source, target])).toEqual([
  ]);
})

test('buildTreeLevel', () => {
  let nodes = [];
  let edges = [];
  const lvl1 = buildTreeLevel(['D phrygian', 'D aeolian', 'D dorian']);
  nodes = nodes.concat(lvl1.nodes);
  edges = edges.concat(lvl1.edges);
  expect({ nodes, edges }).toEqual(
    {
      nodes: [{ label: 'D phrygian', id: '0' }, { label: 'D aeolian', id: '1' }, { label: 'D dorian', id: '2' }],
      edges: [{ source: null, target: '0' }, { source: null, target: '1' }, { source: null, target: '2' }]
    });

  nodes.forEach(({ label, id }) => {
    const next = buildTreeLevel(['G mixolydian', 'G altered'], id);
    nodes = nodes.concat(next.nodes)
    edges = edges.concat(next.edges)
  });
  expect(nodes.map(({ label, id }) => [label, id])).toEqual([
    ['D phrygian', '0'],
    ['D aeolian', '1'],
    ['D dorian', '2'],
    ['G mixolydian', '0.0'],
    ['G altered', '0.1'],
    ['G mixolydian', '1.0'],
    ['G altered', '1.1'],
    ['G mixolydian', '2.0'],
    ['G altered', '2.1']
  ])
  expect(edges.map(({ source, target }) => [source, target])).toEqual([
    [null, '0'],
    [null, '1'],
    [null, '2'],
    ['0', '0.0'],
    ['0', '0.1'],
    ['1', '1.0'],
    ['1', '1.1'],
    ['2', '2.0'],
    ['2', '2.1'],
  ]);
})

test('buildTree', () => {
  const tree = buildTree([['A', 'B'], ['C', 'D'], ['E', 'F']]);
  expect(tree.nodes.map(({ label, id }) => [label, id])).toEqual([
    ['A', '0'],
    ['B', '1'],
    // ['C', '2'],
    ['C', '0'],
    // ['D', '3'],
    ['D', '1'],
    // ['E', '4'],
    ['E', '0'],
    // ['F', '5'],
    ['F', '1'],
  ])
})