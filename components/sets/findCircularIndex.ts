// return first matching index, visiting all items in a circular fashion, starting from index offset
export default (array, matchFn, offset = 0) => {
  let matchIndex = -1;
  let i = -1;
  while (matchIndex === -1 && ++i < array.length) {
    const checkIndex = (i + offset) % array.length;
    if (matchFn(array[checkIndex], checkIndex, array)) {
      matchIndex = checkIndex;
    }
  }
  return matchIndex;
}