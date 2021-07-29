import { editTree } from './editTree';
import { getRhythmChildren, RhythmNode } from '../util';

// r2d3 = rhythm to d3 => map rhythmical object to d3-hierarchy format
export function r2d3<T>(rhythm: RhythmNode<T>, mapFn?) {
  let path = [];
  return editTree<RhythmNode<T>>(
    getRhythmChildren,
    function makeParent(r, children) {
      return {
        name: 'parent',
        children,
        ...r,
      }
    },
    function before(r, i, children, parent) {
      i !== undefined && path.push([i, children.length]);
      if (mapFn) {
        r = mapFn(r, path, parent);
      }
      return r;
    },
    function after(r, i) {
      i !== undefined && path.pop();
      return r;
    },
    rhythm
  );
}

// r2d3 = rhythm to d3 => map rhythmical object to d3-hierarchy format : WITH DURATION
export function ro2d3<T>(rhythm: RhythmNode<T>, mapFn?) {
  let path = [];
  return editTree<RhythmNode<T>>(
    getRhythmChildren,
    function makeParent(r, children) {
      return {
        name: 'parent',
        children,
        ...r,
      }
    },
    function before(r, i, children, parent) {
      if (i !== undefined && children) {
        const durations = children.map((child: any) => (child?.duration || 1));
        const sum = (durations) => durations.reduce((sum, d) => d + sum, 0);
        path.push([sum(durations.slice(0, i)), sum(durations), (r as any)?.duration || 1]);
      }
      if (mapFn) {
        r = mapFn(r, path, parent);
      }
      return r;
    },
    function after(r, i) {
      i !== undefined && path.pop();
      return r;
    },
    rhythm
  );
}
