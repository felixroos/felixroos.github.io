import reorder from './reorder';

// reorder chroma to reflect the given steps, see reorder or tests for more info
export default (chromaticChroma: string, step: number) => {
  return reorder(chromaticChroma.split(''), step).join('');
}