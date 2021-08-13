import { Scale } from '@tonaljs/tonal';
import chromaReflection from './chromaReflection';
import chromaScale from './chromaScale';
import scaleChroma from './scaleChroma';

export default (scale, axis, axisBefore, tonic, scales = Scale.names()) => {
  tonic = tonic || Scale.get(scale).tonic;
  return chromaScale(chromaReflection(scaleChroma(scale), axis, axisBefore), tonic, scales);
}