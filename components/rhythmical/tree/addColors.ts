import { mapHierarchy } from './mapHierarchy';
import { getRhythmChildren, makeRhythmParent, RhythmNode, toRhythmObject } from '../util';

function rhythmTreeChildren<T, S>({ data, ...props }: { data: RhythmNode<T> } & S) {
  return getRhythmChildren<T>(data)?.map(child => ({ data: child, ...props }));
}
function rhythmTreeParent<T, S>({ data, ...props }: { data: RhythmNode<T> } & S, children: Array<{ data: RhythmNode<T> } & S>) {
  return {
    data: makeRhythmParent(data, children.map(({ data }) => data)),
    ...props
  };
}

// this is currently not in use. kept it to show how mapHierarchy can be used..

export function addColors<T>(rhythm: RhythmNode<T>, scheme: string[]) {
  const { data } = mapHierarchy<{
    data: RhythmNode<T>,
    path: number[][],
  }>(
    rhythmTreeChildren,
    rhythmTreeParent,
    ({ data, path }, index, children) => {
      if (children) {
        path = path.concat([[index, children.length]]);
      }
      const color = path?.length ? scheme[path.length - 1] : 'black';
      return { data: { ...toRhythmObject(data), color }, path }
    },
    { data: rhythm, path: [] });
  return data;
}
