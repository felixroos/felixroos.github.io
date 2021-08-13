import chordScales from '../sets/chordScales';
import scaleChroma from '../sets/scaleChroma';
import scaleDifference from '../sets/scaleDifference';
import scaleModes from '../sets/scaleModes';
import astar, { generateAstar, openNext, Target } from './astar';

test('astar', () => {

  const graph = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C lydian', 'C major']];
  const getNodeID = (level, scale) => `${level}.${scale}`;
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const scaleTargets = (graph) => (nodeID) => {
    const [lvl, source] = nodeID.split('.');
    const level = parseInt(lvl);
    if (level >= graph.length - 1) {
      return [];
    }
    return graph[level + 1].map((target): Target => [
      getNodeID(level + 1, target),
      scaleDifference(source, target) + colorDiff(source, target) /* + 1 ,
      graph.length - level - 1 */
    ])
  }
  expect(getNodeID(0, 'D dorian')).toBe('0.D dorian');

  expect(scaleTargets(graph)('1.G mixolydian')).toEqual([['2.C lydian', 3], ['2.C major', 0]]);

  const start = graph[0].map(scale => getNodeID(0, scale));
  const lastLvl = graph.length - 1;
  const end = graph[lastLvl].map(scale => getNodeID(lastLvl, scale));

  expect(astar(start, end, scaleTargets(graph))).toEqual(['0.D dorian', '1.G mixolydian', '2.C major']);

  const scalePath = (choices) => astar(
    choices[0].map(scale => getNodeID(0, scale)),
    choices[choices.length - 1].map(scale => getNodeID(choices.length - 1, scale)),
    scaleTargets(choices)
  ).map(node => node.split('.')[1])

  expect(scalePath(graph)).toEqual(['D dorian', 'G mixolydian', 'C major']);
  expect(scalePath([['D major']])).toEqual(['D major']);
  expect(scalePath([['D major'], ['D major', 'Db major']])).toEqual(['D major', 'D major']);

  const attyaChords = ['Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Dm7', 'G7', 'C^7', 'C^7', 'Cm7', 'Fm7', 'Bb7', 'Eb^7', 'Ab^7', 'Am7', 'D7', 'G^7', 'G^7', 'Am7', 'D7', 'G^7', 'G^7', 'F#h7', 'B7b9', 'E^7', 'C7b13', 'Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Db-^7', 'Cm7', 'Bo7', 'Bbm7', 'Eb7', 'Ab^7', 'Gh7', 'C7b9'];
  const attyaScales = attyaChords.map(chord => chordScales(chord, scaleModes('major', 'harmonic minor', 'melodic minor'), true));

  expect(scalePath(attyaScales)).toEqual(
    [
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "D dorian",
      "G mixolydian",
      "C major",
      "C major",
      "C aeolian",
      "F dorian",
      "Bb mixolydian",
      "Eb major",
      "Ab lydian",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "F# locrian",
      "B phrygian dominant",
      "E lydian",
      "C altered",
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "Db- lydian",
      "C phrygian",
      "B ultralocrian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "G locrian",
      "C phrygian dominant",
    ]
  );



})


test('openNext', () => {
  const getNodeID = (level, scale) => `${level}.${scale}`;
  const graph = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C lydian', 'C major']];
  const start = graph[0].map(scale => getNodeID(0, scale));
  const lastLvl = graph.length - 1;
  const end = graph[lastLvl].map(scale => getNodeID(lastLvl, scale));
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const scaleTargets = (graph) => (nodeID) => {
    const [lvl, source] = nodeID.split('.');
    const level = parseInt(lvl);
    if (level >= graph.length - 1) {
      return [];
    }
    return graph[level + 1].map((target): Target => [
      getNodeID(level + 1, target),
      scaleDifference(source, target) + colorDiff(source, target) /* + 1 ,
      graph.length - level - 1 */
    ])
  }

  let next = openNext(start, end, scaleTargets(graph));
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0]]);
  expect(next.open).toEqual([["0.D aeolian", "1.G mixolydian", 3], [null, "0.D dorian", 0]]);

  next = openNext(start, end, scaleTargets(graph), next);
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0]]);
  expect(next.open).toEqual([["0.D aeolian", "1.G mixolydian", 3], ["0.D dorian", "1.G mixolydian", 0]]);

  next = openNext(start, end, scaleTargets(graph), next);
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0], ["0.D dorian", "1.G mixolydian", 0]]);
  expect(next.open).toEqual([["1.G mixolydian", "2.C lydian", 3], ["1.G mixolydian", "2.C major", 0]]);

  next = openNext(start, end, scaleTargets(graph), next);
  expect(next.winner).toEqual(['0.D dorian', '1.G mixolydian', '2.C major']);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0], ["0.D dorian", "1.G mixolydian", 0]]);
  expect(next.open).toEqual([["1.G mixolydian", "2.C lydian", 3], ["1.G mixolydian", "2.C major", 0]]);

})

test('generateAstar', () => {
  const getNodeID = (level, scale) => `${level}.${scale}`;
  const graph = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C lydian', 'C major']];
  const start = graph[0].map(scale => getNodeID(0, scale));
  const lastLvl = graph.length - 1;
  const end = graph[lastLvl].map(scale => getNodeID(lastLvl, scale));
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const scaleTargets = (graph) => (nodeID) => {
    const [lvl, source] = nodeID.split('.');
    const level = parseInt(lvl);
    if (level >= graph.length - 1) {
      return [];
    }
    return graph[level + 1].map((target): Target => [
      getNodeID(level + 1, target),
      scaleDifference(source, target) + colorDiff(source, target) /* + 1 ,
      graph.length - level - 1 */
    ])
  }

  const gen = generateAstar(start, end, scaleTargets(graph));

  let next = gen.next().value;
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([]);
  expect(next.open).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0]]);

  next = gen.next().value;
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0]]);
  expect(next.open).toEqual([["0.D aeolian", "1.G mixolydian", 3], [null, "0.D dorian", 0]]);

  next = gen.next().value;
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0]]);
  expect(next.open).toEqual([["0.D aeolian", "1.G mixolydian", 3], ["0.D dorian", "1.G mixolydian", 0]]);

  next = gen.next().value;
  expect(next.winner).toEqual(false);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0], ["0.D dorian", "1.G mixolydian", 0]]);
  expect(next.open).toEqual([["1.G mixolydian", "2.C lydian", 3], ["1.G mixolydian", "2.C major", 0]]);

  next = gen.next().value;
  expect(next.winner).toEqual(['0.D dorian', '1.G mixolydian', '2.C major']);
  expect(next.closed).toEqual([[null, "0.D aeolian", 0], [null, "0.D dorian", 0], ["0.D dorian", "1.G mixolydian", 0]]);
  expect(next.open).toEqual([["1.G mixolydian", "2.C lydian", 3], ["1.G mixolydian", "2.C major", 0]]);


})