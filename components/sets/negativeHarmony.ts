import { Note } from '@tonaljs/tonal';
import chromaReflection from './chromaReflection';

export default function negativeHarmony(chroma, tonic) {
  const axis = (Note.chroma(tonic) + 4) % 12;
  return chromaReflection(chroma, axis, true);
}