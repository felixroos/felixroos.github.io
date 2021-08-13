import { Note } from '@tonaljs/tonal';
import chromaCenter from '../chromaCenter';
import reorderChroma from '../reorderChroma';
import scaleChroma from '../scaleChroma';

test('chromaCenter', () => {
  // tested with dorian, as it is the harmonic "equilibrium" (see circle)
  expect(chromaCenter(reorderChroma(scaleChroma('C dorian'), 7))).toBe(Note.chroma('C'));
  expect(chromaCenter(reorderChroma(scaleChroma('F dorian'), 7))).toBe(Note.chroma('F'));
  expect(chromaCenter(reorderChroma(scaleChroma('Bb dorian'), 7))).toBe(Note.chroma('Bb'));
  expect(chromaCenter(reorderChroma(scaleChroma('Eb dorian'), 7))).toBe(Note.chroma('Eb'));
  expect(chromaCenter(reorderChroma(scaleChroma('Ab dorian'), 7))).toBe(Note.chroma('Ab'));
  expect(chromaCenter(reorderChroma(scaleChroma('Db dorian'), 7))).toBe(Note.chroma('Db'));
  expect(chromaCenter(reorderChroma(scaleChroma('Gb dorian'), 7))).toBe(Note.chroma('Gb'));
  expect(chromaCenter(reorderChroma(scaleChroma('B dorian'), 7))).toBe(Note.chroma('B'));
  expect(chromaCenter(reorderChroma(scaleChroma('E dorian'), 7))).toBe(Note.chroma('E'));
  expect(chromaCenter(reorderChroma(scaleChroma('A dorian'), 7))).toBe(Note.chroma('A'));
  expect(chromaCenter(reorderChroma(scaleChroma('D dorian'), 7))).toBe(Note.chroma('D'));
  expect(chromaCenter(reorderChroma(scaleChroma('G dorian'), 7))).toBe(Note.chroma('G'));
})