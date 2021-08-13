import { Path } from './extendBestPath';

export default function buildTree(paths: Path[], getColor?: (string) => string, getValue?) {
  const nodes: object[] = [{ label: 'start', id: '0' }];
  const edges = [];
  const getId = (x, y, label) => `${x}.${y}:${label}`;
  paths?.forEach((current, p) => {
    const { path, values, value } = current;
    const ids = [];
    path.forEach((choice, c) => {
      const pathString = (p, n) => p.slice(0, n).join('.');
      const match = paths.slice(0, p).find(({ path: p }) => pathString(p, c + 1) === pathString([...path, choice], c + 1));
      if (!match) {
        ids.unshift(getId(p, c, choice));
        const color = (getColor ? { fillcolor: getColor(choice) || 'white', style: 'filled' } : {});
        nodes.push({ label: choice, id: ids[0], ...color });
      } else {
        const x = paths.indexOf(match);
        ids.unshift(getId(x, c, choice))
      }
      if (!c) {
        edges.push({ source: '0', target: ids[0], label: '0' })
      } else {
        const diff = values?.[c] ?? getValue?.(path[c - 1], choice) ?? '';
        const label = diff !== undefined ? `+${diff}` + (c === path.length - 1 ? `=${value}` : '') : '';
        edges.push({ source: ids[1], target: ids[0], label })
      }
    });
  })
  return { nodes, edges }
}