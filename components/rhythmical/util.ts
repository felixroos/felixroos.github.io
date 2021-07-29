import { sum, max } from 'd3-array';

export declare interface RhythmObject<T> {
  value?: T,
  path?: Path,
  sequential?: RhythmNode<T>[],
  parallel?: RhythmNode<T>[],
  duration?: number,
  [key: string]: any
} // TBD: convert from "option bag" to union: ParallelRhythm | SequentialRhythm | LeafRhythm
export declare interface RhythmLeaf<T> extends RhythmObject<T> {
  value: T
}

export declare type RhythmNode<T> = T | T[] | RhythmNode<T>[] | RhythmObject<T>;
export declare type Fraction = number[];
export declare type Path = Fraction[];
export declare type RhythmEvent<T> = {
  value: T, path?: Path, time?: number, duration?: number
}

// returns fraction of a node, based on sibling durations (path = fraction[])
export function rhythmFraction<T>(
  node: RhythmNode<T>,
  index?: number,
  siblings?: RhythmNode<T>[],
  parent?: RhythmNode<T>
): Fraction {
  const duration = (node as RhythmObject<T>).duration ?? 1;
  if (!parent) {
    // root node
    return [0, duration, 1]
  }
  const durations = siblings.map((sibling: RhythmObject<T>) => sibling.duration ?? 1);
  const total = sum(durations);
  if ((parent as RhythmObject<T>)?.parallel) {
    // parallel path
    return [0, duration, max(durations)];
  }
  const time = sum(durations.slice(0, index));
  // sequential path
  return [time, duration, total]
}

export function isRhythmLeaf<T>(rhythm: RhythmNode<T>) {
  return !getRhythmChildren(rhythm)?.length;
}

export function rhythmValue<T>(rhythm: RhythmNode<T>): T {
  return toRhythmObject<T>(rhythm).value;
}

export function rhythmEvent<T>(rhythm: RhythmNode<T>, path): RhythmEvent<T> {
  return { value: rhythmValue(rhythm), ...pathTimeDuration(path) }
}

// without variable durations (path = Array<[time, siblings]>)
export function pathTimeDurationSimple(path: Path, whole = 1): { time: number, duration: number } {
  let time = 0;
  let duration = whole;
  for (let i = 0; i < path.length; i++) {
    time = time + path[i][0] / path[i][1] * duration
    duration /= path[i][1];
  }
  return { time, duration };
}

// returns time duration from path array (array of fractions)
export function pathTimeDuration(path: Path, whole = 1): { time: number, duration: number } {
  let time = 0;
  let duration = whole;
  for (let i = 0; i < path.length; i++) {
    time = time + path[i][0] / path[i][2] * duration
    duration *= path[i][1] / path[i][2];
  }
  return { time, duration };
}

// returns array of children for a rhythm object (if any)
export function getRhythmChildren<T>(node: RhythmNode<T>): RhythmNode<T>[] {
  return Array.isArray(node)
    ? node
    : (node as RhythmObject<T>)?.parallel || (node as RhythmObject<T>)?.sequential
}

// enforces type object
export function toRhythmObject<T>(child: RhythmNode<T>): RhythmObject<T> {
  if (typeof child !== 'object') {
    return {
      value: child
    }
  }
  if (Array.isArray(child)) {
    return {
      sequential: child
    }
  }
  return child as RhythmObject<T>;
}

export function getRhythmType(rhythm: RhythmNode<any>) {
  if (Array.isArray(rhythm) || rhythm.sequential?.length) {
    return 'sequential'
  }
  if (rhythm.parallel?.length) {
    return 'parallel';
  }
  return 'leaf';
}

// emits new object for parent + children
export function makeRhythmParent<T>(oldParent: RhythmObject<T> | RhythmNode<T>[], children: RhythmNode<T>[]): RhythmNode<T>[] | RhythmObject<T> {
  if (Array.isArray(oldParent)) {
    return children;
  }
  if (oldParent.parallel) {
    return { ...oldParent, parallel: children };
  }
  return { ...oldParent, sequential: children };
}

export function stripEvent<T>(event: RhythmEvent<T>): [T, number, number] {
  return [event.value, event.time, event.duration];
}


// path stuff

export function pathString(path: [number, number, number][]) {
  return path.map(p => p.join(':')).join(' ');
}

export function indexPathString(path: number[]) {
  return path?.join(':') || '';
}

export function haveSameIndices(a: number[], b: number[]) {
  return indexPathString(a) === indexPathString(b);
}

// maybe deprecated

// convenience function to call a function on the value of either object or primitive
export function editLeafValue<T>(fn: (value: T) => T) {
  return (leaf: RhythmNode<T>) => {
    // a leaf is not an array..
    if (typeof leaf === 'object') {
      return {
        ...leaf,
        value: fn((leaf as RhythmObject<T>).value)
      }
    }
    return fn(leaf);
  }
}
