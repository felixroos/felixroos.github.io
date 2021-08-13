import { interpolateSinebow } from 'd3-scale-chromatic';
import chromaCenter from './chromaCenter';

export default function chromaColor(chroma) {
  return interpolateSinebow(chromaCenter(chroma) / 12);
}