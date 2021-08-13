import chordChroma from '../chordChroma';
import negativeHarmony from '../negativeHarmony';
import scaleChroma from '../scaleChroma';

test('negativeHarmony', () => {
  expect(negativeHarmony(scaleChroma('C major'), 'C')).toBe(scaleChroma('C minor'));
  expect(negativeHarmony(chordChroma('C'), 'C')).toBe(chordChroma('Cm'));
  expect(negativeHarmony(chordChroma('Eb'), 'C')).toBe(chordChroma('Am')); // https://www.youtube.com/watch?v=x6zypc_LhnM
  expect(negativeHarmony(chordChroma('Eb6'), 'C')).toBe(chordChroma('Am7'));
  expect(negativeHarmony(chordChroma('C^7'), 'C')).toBe(chordChroma('Ab^7'));
  expect(negativeHarmony(chordChroma('F^7'), 'C')).toBe(chordChroma('Eb^7'));
  expect(negativeHarmony(chordChroma('F'), 'C')).toBe(chordChroma('Gm'));
  expect(negativeHarmony(chordChroma('Dm7'), 'C')).toBe(chordChroma('Gm7'));
  expect(negativeHarmony(chordChroma('G7'), 'C')).toBe(chordChroma('Dm7b5'));
  expect(negativeHarmony(scaleChroma('D major'), 'D')).toBe(scaleChroma('D minor'));
})