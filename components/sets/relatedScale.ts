import chromaScale from './chromaScale';
import scaleChroma from './scaleChroma';

// get related scale from different root
export default (scale: string, root: string) => {
  return chromaScale(scaleChroma(scale), root);
}