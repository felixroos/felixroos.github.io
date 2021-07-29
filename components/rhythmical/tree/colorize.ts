import { mapRhythm } from './mapRhythm';
import { getRhythmChildren, RhythmNode, toRhythmObject } from '../util';

export function colorize<T>(rhythm: RhythmNode<T>, scheme: string[]) {
  return mapRhythm((node, path = []) => {
    const children = getRhythmChildren(node);
    node = toRhythmObject(node);
    return [
      { color: path.length ? scheme[path.length - 1] : 'black', ...node, },
      path.concat(children?.length ? [children.indexOf(node)] : []),
    ];
  }, rhythm)
}