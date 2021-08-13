import chordScales from '../sets/chordScales';
import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import scaleModes from '../sets/scaleModes';
import countPathExtensions from './countPathExtensions';

test('countPathExtensions', () => {
  const colorDiff = (source, target) => {
    return source && scaleChroma(source) !== scaleChroma(target) ? 1 : 0;
  };
  const withColorDiff = (source, target) => {
    return chromaDifference(scaleChroma(source), scaleChroma(target)) + colorDiff(source, target)
  };
  const withoutColorDiff = (a, b) => chromaDifference(scaleChroma(a), scaleChroma(b));
  const scales = scaleModes('major', 'melodic minor', 'harmonic minor');
  const solar = ['CmM7', 'Gm7', 'C7', 'F^7', 'Fm7', 'Bb7', 'Eb^7', 'Ebm7', 'Ab7', 'Db^7', 'Dm7b5', 'G7b9']
    .map(chord => chordScales(chord, scales, true))
  expect(countPathExtensions(solar, withColorDiff)).toBe(2755);
  expect(countPathExtensions(solar, withColorDiff, true)).toBe(47);
  expect(countPathExtensions(solar, withoutColorDiff)).toBe(3864);
  expect(countPathExtensions(solar, withoutColorDiff, true)).toBe(46);

})