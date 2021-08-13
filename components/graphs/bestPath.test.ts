import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleModes from '../sets/scaleModes';
import bestPath from './bestPath'

describe('bestPath', () => {
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  test('251', () => {
    const graph1 = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian']];
    const getValue = (source, target) => {
      return chromaDifference(scaleChroma(source), scaleChroma(target))
    };

    expect(bestPath(graph1, getValue)).toEqual(['D dorian', 'G mixolydian', 'C major']);
    const graph2 = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian'], ['C aeolian', 'C dorian'], ['F mixolydian'], ['Bb major', 'Bb lydian']];
    expect(bestPath(graph2, getValue)).toEqual(['D dorian', 'G mixolydian', 'C major', 'C dorian', 'F mixolydian', 'Bb major']);
  })

  test('solar', () => {
    const getValue = (source, target) => {
      return chromaDifference(scaleChroma(source), scaleChroma(target)) + colorDiff(source, target)
    };
    const scales = scaleModes('major', 'melodic minor', 'harmonic minor');
    const candidates = ['CmM7', 'Gm7', 'C7', 'F^7', 'Fm7', 'Bb7', 'Eb^7', 'Ebm7', 'Ab7', 'Db^7', 'Dm7b5', 'G7b9'].map(chord => chordScales(chord, scales, true))
    expect(bestPath(candidates, getValue)).toEqual(['C melodic minor', 'G dorian', 'C mixolydian', 'F major', 'F dorian', 'Bb mixolydian', 'Eb major', 'Eb dorian', 'Ab mixolydian', 'Db major', 'D locrian 6', 'G phrygian dominant']);
  })
})