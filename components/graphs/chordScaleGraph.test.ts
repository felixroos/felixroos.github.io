import scaleModes from '../sets/scaleModes'
import chordScaleGraph from './chordScaleGraph'

test('chordScaleGraph', () => {
  const { nodes, edges } = chordScaleGraph(['Dm7', 'G7', 'C^7'], scaleModes('major'));
  expect(nodes.map(({ label, id }) => [id, label])).toEqual([
    [0, 'D dorian'],
    [1, 'D aeolian'],
    [2, 'D phrygian'],
    [3, 'G mixolydian'],
    [4, 'C lydian'],
    [5, 'C major']]);

  expect(edges.map(({ source, target }) => [source, target])).toEqual([
    [0, 3], [1, 3], [2, 3],
    [3, 4], [3, 5]
  ]);
})