// reorder array items in a circular fashion. 
// the subsequent indices of the returned item are "step" away in the given array
// items may be skipped or duplicated if items.length % step !== 1
export default (items: any[], step: number) => {
  return items.map((_, i, a) => a[(i * step) % a.length]);
}
// could be Collection.reorder