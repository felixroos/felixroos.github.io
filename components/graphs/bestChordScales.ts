import chordScales from '../sets/chordScales';
import scaleChroma from '../sets/scaleChroma';
import scaleDifference from '../sets/scaleDifference';
import scaleModes from '../sets/scaleModes';
import astar, { Target } from './astar';

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

export default function bestChordScales(chords, scales = [...scaleModes('major'), ...scaleModes('harmonic minor', 'melodic minor')], loop?, fallbackScale = 'chromatic') {
  if (loop) {
    chords = [...chords, ...chords, ...chords];
  }
  const choices = chords.map(chord => chordScales(chord, scales, true, fallbackScale));
  const bestPath = astar(
    choices[0].map(scale => getNodeID(0, scale)),
    choices[choices.length - 1].map(scale => getNodeID(choices.length - 1, scale)),
    scaleTargets(choices)
  ).map(node => node.split('.')[1])
  if (loop) {
    return bestPath.slice(bestPath.length / 3, 2 * bestPath.length / 3);
  }
  return bestPath;
}