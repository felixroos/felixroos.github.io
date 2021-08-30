import { Note } from '@tonaljs/tonal';
import chordChroma from '../chordChroma';
import chromaReflection from '../chromaReflection'
import scaleChroma from '../scaleChroma';

test('chromaReflection', () => {
  expect(chromaReflection(scaleChroma('C major'))).toBe(scaleChroma('Ab major'));
  expect(chromaReflection(scaleChroma('Ab major'), Note.chroma('Ab'))).toBe(scaleChroma('E major'));
  expect(chromaReflection(scaleChroma('Ab major'), Note.chroma('Ab'))).toBe(scaleChroma('E major'));
  expect(chromaReflection(scaleChroma('E major'), Note.chroma('E'))).toBe(scaleChroma('C major'));

  expect(chromaReflection(scaleChroma('C major'), Note.chroma('G'))).toBe(scaleChroma('Bb major'));
  expect(chromaReflection(scaleChroma('Bb major'), Note.chroma('F'))).toBe(scaleChroma('Ab major'));
  expect(chromaReflection(scaleChroma('Ab major'), Note.chroma('Eb'))).toBe(scaleChroma('Gb major'));
  expect(chromaReflection(scaleChroma('F# major'), Note.chroma('C#'))).toBe(scaleChroma('E major'));
  expect(chromaReflection(scaleChroma('E major'), Note.chroma('B'))).toBe(scaleChroma('D major'));
  expect(chromaReflection(scaleChroma('D major'), Note.chroma('A'))).toBe(scaleChroma('C major'));
})

/* test('chromaReflection axisBefore', () => {
  expect(chromaReflection(scaleChroma('C major'), 4,true)).toBe(scaleChroma('C minor'));
  expect(chromaReflection(chordChroma('C'), 4, true)).toBe(chordChroma('Cm'));
  expect(chromaReflection(chordChroma('G7'), 4, true)).toBe(chordChroma('Dm7b5'));
  expect(chromaReflection(chordChroma('Dm7'), 4, true)).toBe(chordChroma('C'));
}) */