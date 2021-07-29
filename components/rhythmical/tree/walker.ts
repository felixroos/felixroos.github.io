import { curry, pipe } from 'ramda';
import { pathTimeDuration, rhythmFraction, getRhythmChildren, toRhythmObject, makeRhythmParent, editLeafValue, RhythmNode, RhythmEvent, RhythmObject, RhythmLeaf } from '../util';
import { Note } from '@tonaljs/tonal';

// walks over nested tree object
// works with any tree structure, using the following options:
// getChildren: function that resolves children of a node (if any)
// makeParent: constructs new parent node with (node, children)
// makeChild?: constructs new child node with access to (node, index, siblings, parent)
// makeLeaf?: constructs leaf (no children)

declare type walkMapFn<T> = (node: T, index?: number, siblings?: T[], parent?: T) => T;
declare type WalkOptions<T> = {
  getChildren: (node: T) => T[],
  makeParent: (node: T, children: T[]) => T,
  makeChild?: (node: T, index: number, siblings: T[], parent?: T) => T,
  makeLeaf?: (node: T) => T
}


export function walk<T>(options: WalkOptions<T>, root: T): T {
  const { getChildren, makeParent, makeChild, makeLeaf } = options;
  const children = getChildren(root);
  if (!children) {
    return makeLeaf ? makeLeaf(root) : root;
  }
  return makeParent(
    root,
    children.map((child, index) => walk(
      options,
      makeChild ? makeChild(child, index, children, root) : child,
    ))
  )
}

export const walker = curry(walk);

const rhythmWalkOptions: Partial<WalkOptions<RhythmNode<any>>> = {
  getChildren: getRhythmChildren,
  makeParent: makeRhythmParent,
}



// turns rhythm object into flat events with value, time, duration & path
export function flatEvents<T>(rhythm: RhythmNode<T>): RhythmEvent<T>[] {
  const events: RhythmEvent<T>[] = [];
  let rootNode = toRhythmObject(rhythm);
  walker({
    ...rhythmWalkOptions,
    makeChild: (node: RhythmNode<T>, index, siblings, parent?: RhythmNode<T>) => ({
      ...toRhythmObject(node),
      path: ((parent as RhythmObject<T>)?.path || []).concat([
        rhythmFraction(node, index, siblings, parent)
      ])
    }),
    makeLeaf: ({ path, ...leaf }: RhythmLeaf<T>) => {
      events.push({
        ...leaf,
        path,
        ...pathTimeDuration(path)
      })
      return leaf;
    }
  } as WalkOptions<RhythmNode<T>>, {
    ...toRhythmObject(rootNode),
    path: [rhythmFraction(rootNode)]
  });
  return events;
}

function isLeaf(node) {
  return !getRhythmChildren(node);
}

// little sugar function that calls function once on every node
// provides additional index, siblings + parent info if present with fallbacks
export const mapRhythm: any = curry((mapFn: any, rhythm) => {
  const mapper: walkMapFn<any> = (rhythm, index = 0, siblings = [rhythm], parent?) =>
    mapFn(rhythm, 0, [rhythm]);

  return walker({
    ...rhythmWalkOptions,
    makeChild: mapFn
  } as any, mapper(rhythm));
});



// transpose test:

const tranposeNode = curry((interval, node) => {
  if (isLeaf(node)) {
    return editLeafValue(value => {
      if (typeof value !== 'string' || !Note.midi(value)) {
        return value;
      }
      return Note.transpose(value, interval)
    })(node)
  }
  return node;
})



const tranposeRhythm = curry((interval, rhythm) => mapRhythm(tranposeNode(interval), rhythm));

const r = ['C3', ['D3', { value: 'E3' }]];
const transposed = tranposeRhythm('2m', r);

