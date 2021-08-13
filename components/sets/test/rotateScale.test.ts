import rotateScale from '../rotateScale';
import scaleModes from '../scaleModes'

test('rotateScale', () => {
  expect(rotateScale('C major', 1, scaleModes('major'))).toBe('C dorian');
  expect(rotateScale('C major', 7, scaleModes('major'))).toBe('C mixolydian');
  expect(rotateScale('C major', 5, scaleModes('major'))).toBe('C lydian');
  expect(rotateScale('C lydian', 5, scaleModes('major'))).toBe('C locrian');
  expect(rotateScale('G lydian', 5, scaleModes('major'))).toBe('G locrian');
})

/*
test('G lydian fourth up', () => {
  const scale = 'G lydian';
  const step = 5;

  const { tonic } = Scale.get(scale);
  const t = Note.chroma(tonic);
  expect(tonic).toBe('G');
  expect(t).toBe(7);
  expect(scaleChroma(scale)).toBe('011010110101')
  const chroma = reorderChroma(scaleChroma(scale), step);
  expect(chroma).toBe('000001111111');
  const currentIndex = (Note.chroma(tonic) * step) % 12;
  expect(currentIndex).toBe(11); // G = 1 fourth below C
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12;
  expect(nextOne(chroma, currentIndex)).toBe(5); // index in harmonic chroma
  expect(nextIndex).toBe(1) // index in chromatic chroma
  const nextChroma = Collection.rotate(nextIndex + 12 - t, scaleChroma(scale).split('')).join('')
  expect(nextChroma).toBe('110101011010'); // g = 0 ...
  expect(chromaScale(nextChroma, tonic)).toBe('G locrian')
})


test('C lydian fourth up', () => {
  const scale = 'C lydian';
  const step = 5;

  const { tonic } = Scale.get(scale);
  expect(tonic).toBe('C');
  expect(scaleChroma(scale)).toBe('101010110101')
  const chroma = reorderChroma(scaleChroma(scale), step);
  expect(chroma).toBe('100000111111');
  expect(Note.chroma(tonic)).toBe(0);
  const currentIndex = (Note.chroma(tonic) * step) % 12;
  expect(currentIndex).toBe(0);
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12;
  expect(nextOne(chroma, currentIndex)).toBe(6); // index in harmonic chroma
  expect(nextIndex).toBe(6) // index in chromatic chroma
  const nextChroma = Collection.rotate(nextIndex, scaleChroma(scale).split('')).join('')
  expect(nextChroma).toBe('110101101010');
  expect(chromaScale(nextChroma, tonic)).toBe('C locrian')
}) */
