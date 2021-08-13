import { minIndex } from 'd3-array';
import generateBestPath from './generateBestPath';

export default function bestPath(graph, getValue) {
  const generator = generateBestPath(graph, getValue);
  let iterator = generator.next();
  while (!iterator.done) {
    iterator = generator.next()
  }
  const paths = iterator.value;
  const best = paths[minIndex(paths, (path) => path.value)];
  return best.path;
}

/* export default function bestPath(graph: string[][], getValue: ValueFn): string[] {
  let paths: Path[] = [];
  let isFinished = false;
  let extensions = [];
  while (!isFinished) {
    const extended = extendBestPath(paths, graph, getValue, extensions);
    if (!extended) {
      isFinished = true;
    } else {
      paths = extended;
    }
  }
  const best = paths[minIndex(paths, (path) => path.value)];
  return best.path;
} */
