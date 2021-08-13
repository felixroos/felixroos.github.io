import extendBestPath, { ValueFn, Path } from './extendBestPath';

export default function countPathExtensions(graph: string[][], getValue: ValueFn, prune?: boolean): number {
  let paths: Path[] = [];
  let isFinished = false;
  let count = 0;
  let extensions = [];
  while (!isFinished) {
    const extended = extendBestPath(paths, graph, getValue, prune ? extensions : []);
    if (!extended) {
      isFinished = true;
    } else {
      count++;
      paths = extended;
    }
  }
  return count;
}