import nextRoot from './nextRoot';
import relatedScale from './relatedScale';

export default (scale, step = 1) => {
  return relatedScale(scale, nextRoot(scale, step));
}

/* // without nextRoot
export default (scale, step = 1) => {
   const { notes, tonic } = Scale.get(scale);
  const chroma = reorderChroma(scaleChroma(scale), step);
  const currentIndex = (Note.chroma(tonic) * step) % 12; // chromatic to circular index
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12;
  const root = notes.find(note => Note.chroma(note) === nextIndex);
  return relatedScale(scale, root);
}
*/
