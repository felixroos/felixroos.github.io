import findCircularIndex from './findCircularIndex';

/* const nextOne = (chroma, index) => {
  const rotated = Collection.rotate(index, chroma.split(''));
  return (rotated.slice(1).indexOf('1') + index + 1) % chroma.length;
} */
export default (chroma, index) => {
  return findCircularIndex(chroma.split(''), d => d === '1', index + 1);
}