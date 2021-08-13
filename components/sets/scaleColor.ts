import scaleChroma from './scaleChroma';
import chromaColor from './chromaColor';
import { TinyColor } from '@ctrl/tinycolor';

export default (scale) => {
  return new TinyColor(chromaColor(scaleChroma(scale))).desaturate(20).lighten(20).toHexString();
};
