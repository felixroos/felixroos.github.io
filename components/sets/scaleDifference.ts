import scaleChroma from './scaleChroma';
import chromaDifference from './chromaDifference';

export default function scaleDifference(a, b) {
  return chromaDifference(scaleChroma(a), scaleChroma(b));
}