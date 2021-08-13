export declare type Path = {
  values?: number[],
  value: number,
  path: string[]
}

// this implementation is not optimal, as it remembers the whole path
// it is much more clever to just remember the connections

export declare type ValueFn = (source: string, target: string, path: Path) => number;

export default function extendBestPath(paths: Path[], graph: string[][], getValue: ValueFn, extended?: any[], keepLongerPaths = false): Path[] | false {
  if (!paths?.length) {
    // if no paths are given, return initial paths
    return graph[0].map(candidate => ({ value: 0, /* values: [0], */ path: [candidate] }))
  }
  // find index with lowest value
  let best;
  // if true, alternative paths with the same value will also be expanded
  const keepAlternatives = false;
  paths = paths?.filter((current) => {
    // >= takes leftmost min, > takes rightmost min
    if (best !== undefined && current.value >= best.value) {
      return true;
    }
    const alreadyExtended = extended?.find(
      ([level, candidate, value]) => current.path[level] === candidate && current.path.length === level + 1 && (!keepAlternatives || value < current.value))
    if (alreadyExtended && !keepLongerPaths) {
      // prune path, as it has already been expanded
      return false;
    }
    best = current;
    return true;
  });
  if (best === undefined) {
    return paths;
  }
  // const bestIndex = minIndex(paths, (path) => path.value);
  const level = best.path.length;
  const extension = [level - 1, best.path[level - 1], best.value];
  // console.log('extension', extension);
  extended?.push(extension);
  // console.log('extensions', extensions);
  const { path, value/* , values */ } = best;
  if (path.length >= graph.length) {
    // throw error if the best path is already at the end => cannot extend any further
    // throw new Error('cannot extendBestPath: graph end reached');
    return false;
  }
  // generate next possible steps by splitting up the best path for all possible next candidates
  const nextSteps: Path[] = graph[path.length].map(candidate => {
    const nextValue = getValue(path[path.length - 1], candidate, best);
    return {
      value: value + nextValue,
      /* values: values.concat([nextValue]), */
      path: path.concat(candidate)
    }
  });
  // replace best path with nextSteps
  const bestIndex = paths.indexOf(best);
  return paths.slice(0, bestIndex).concat(nextSteps, paths.slice(bestIndex + 1));
  // now using concat for performance boost
  // return [...paths.slice(0, bestIndex), ...nextSteps, ...paths.slice(bestIndex + 1)]
}