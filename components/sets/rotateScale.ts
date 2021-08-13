import { Collection } from '@tonaljs/tonal';
import { Note, Scale } from '@tonaljs/tonal';
import chromaScale from './chromaScale';
import nextOne from './nextOne';
import reorderChroma from './reorderChroma';
import scaleChroma from './scaleChroma';

export default (scale, step, scaleTypes = Scale.names()) => {
  const { tonic } = Scale.get(scale);
  const t = Note.chroma(tonic);
  const chroma = reorderChroma(scaleChroma(scale), step);
  const currentIndex = (t * step) % 12;
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12;
  const nextChroma = Collection.rotate(nextIndex + 12 - t, scaleChroma(scale).split('')).join('')
  return chromaScale(nextChroma, tonic, scaleTypes);
}

// keep root and scale shape, rotate around root
/*
import { Collection, Note, Scale } from '@tonaljs/tonal';
import chromaScale from './chromaScale';
import rotateChroma from './rotateChroma';

export default (n, scale, scaleTypes = Scale.names()) => {
  const { tonic, chroma } = Scale.get(scale);
  const rotatedChroma = rotateChroma(n, chroma);
  const rotated = Collection.rotate(12 - Note.get(tonic).chroma, rotatedChroma.split('')).join('');
  return chromaScale(rotated, tonic, scaleTypes);
}; */