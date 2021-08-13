import scaleModes from '../sets/scaleModes';
import chordScales from '../sets/chordScales';
import { Chord } from '@tonaljs/tonal';
import bySetNum from '../sets/bySetNum';
import scaleColor from '../sets/scaleColor';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';

export default (chords, allowedScales = scaleModes('major'), halfDifference = false) => {
  const scales = chords
    .map((chord) => chordScales(chord, allowedScales))
    .map((choices) => (choices.length > 0 ? choices : ['chromatic']));
  let nodes = [];
  let links = [];
  scales.forEach((choices, i) => {
    choices
      .map((choice) => `${Chord.tokenize(chords[i])[0]} ${choice}`)
      .sort(bySetNum)
      .forEach((choice, j) => {
        if (i > 0) {
          const prev = scales[i - 1];
          prev.forEach((sourceScale, k) => {
            const source = nodes.length - j - prev.length + k;
            const target = nodes.length;
            let label = chromaDifference(scaleChroma(nodes[source].label), scaleChroma(choice));
            if (halfDifference) {
              label /= 2;
            }
            links.push({ source, target, label });
          });
        }
        nodes.push({ label: choice, fillcolor: scaleColor(choice), style: 'filled' });
      });
  });
  nodes = nodes.map((node, id) => ({ ...node, id }));
  return { nodes, edges: links };
};