import connectionGraph from './connectionGraph';

test('connectionGraph', () => {
  expect(
    connectionGraph({
      open: [
        [null, '0.D phrygian', 0],
        [null, '0.D aeolian', 0],
        [null, '0.D dorian', 0],
      ],
      closed: [],
      winner: false,
    })
  ).toEqual({ nodes: [], edges: [] });
});
