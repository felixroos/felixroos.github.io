import { Path } from './extendBestPath';

export declare type GraphOptions = {
  getColor?: (a: string) => string,
  getValue?: (a: string, b: string) => number,
  includeStartNode?: boolean,
  showDuplicates?: boolean,
  showCalculation?: boolean
};

export default function buildGraph(paths: Path[], { getColor, getValue, includeStartNode, showDuplicates, showCalculation }: GraphOptions) {
  const nodes: any[] = includeStartNode ? [{ label: 'start', id: '0' }] : [];
  const edges = [];
  const getId = (i, j) => `${i}.${j}`;
  paths?.forEach(({ path, value, values }, i) => {
    path.forEach((choice, j) => {
      const target = getId(choice, j);
      const color = getColor ? { fillcolor: getColor(choice), style: 'filled' } : {};
      const match = nodes.find(({ id }) => id === target);
      const isLeaf = j === path.length - 1;
      const isFirst = j === 0;
      if (!match /* || (isLeaf && includeDuplicateLeaves) */) {
        // wont work as id is the same => übereinander
        /* if ((isLeaf && includeDuplicateLeaves)) {
          console.log('add duplicate leaf', label);
        } */
        nodes.push({ label: choice, id: target, level: j, ...color });
      }
      if (isFirst) {
        // is first in path
        includeStartNode && edges.push({ source: '0', target, label: '0' });
        return;
      }
      const source = getId(path[j - 1], j - 1);
      const diff = values?.[j] ?? getValue?.(path[j - 1], choice) ?? '';

      const duplicates = edges.filter(({ source: s, target: t }) => source === s && target === t);
      const isDuplicate = duplicates.length > 0;

      let label;
      if (showCalculation) {
        label = isLeaf && !isDuplicate ? `+${diff}=${value}` : `+${diff}`;
      } else {
        label = diff;
      }

      if (showDuplicates) {
        const count = isDuplicate ? ` (${duplicates.length + 1})` : ''
        label = `${label}${count}`
      }
      // sadly, multiple edges between same nodes is not supported by graphviz
      // https://github.com/shevek/graphviz4j/issues/1
      edges.push({
        source,
        target,
        label
      });
    });
  });
  return { nodes, edges }
}
