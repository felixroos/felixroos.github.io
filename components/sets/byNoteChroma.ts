import { Note } from '@tonaljs/tonal';

export default (a: string, b: string) => {
  const { chroma: chromaA, step: stepA } = Note.get(a)
  const { chroma: chromaB, step: stepB } = Note.get(b)
  return chromaA - chromaB + stepA - stepB;
};