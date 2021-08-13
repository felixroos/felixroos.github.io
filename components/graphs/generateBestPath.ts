import { minIndex } from 'd3-array';
import extendBestPath, { ValueFn, Path } from './extendBestPath';

// this implementation is not optimal, as it remembers the whole path
// it is much more clever to just remember the connections

export default function* generateBestPath(graph: string[][], getValue: ValueFn, options = {}) {
  const { onlyKeepWinner, keepLongerPaths } = {
    keepLongerPaths: false, onlyKeepWinner: false, ...options
  };
  let paths: Path[] = [];
  let isFinished = false;
  let extensions = [];

  while (!isFinished) {
    const extended = extendBestPath(paths, graph, getValue, extensions, keepLongerPaths);
    if (!extended) {
      isFinished = true;
    } else {
      paths = extended;
      yield paths;
    }
  }
  if (onlyKeepWinner) {
    return [paths[minIndex(paths, (path) => path.value)]];
  }
  return paths;
}
