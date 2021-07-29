import { groupPlugins, HierarchyReducerPlugin, plug, reduceHierarchy, StateDigger, StateReducer } from '../deprecated';
import { getRhythmChildren, pathTimeDuration, rhythmFraction, RhythmNode } from '../util';

// ALARM: for reduceHierarchy, swapped inner + outer arguments 1 and 3
// (a,b,c) => ...
// is now
// (c,b,a) => ...
// this is due to the often needed child state
// this has yet to be fixed for this whole file  !!

declare interface RhythmShovel<T> {
  node: RhythmNode<T>,
  events: Array<{ value: RhythmNode<T>, path?: number[][], time: number, duration: number }>,
  path: number[][],
};

declare type RhythmicalPlugin<T> = [
  StateDigger<RhythmShovel<T>>, // resolves children states
  StateReducer<RhythmShovel<T>>, // runs on each child state before going deeper
  StateReducer<RhythmShovel<T>>,
]

const rhythmicalPlugin: RhythmicalPlugin<string> = [
  function dig({ node, ...state }) {
    return getRhythmChildren(node)?.map(child => ({ ...state, node: child }));
  },
  function inner(state, parentState, childState, index, childStates) {
    // this function runs before the child has been processed
    // => here we can pass data down to the children
    if (!parentState) {
      return state;
    }
    let { node: parent, events, path } = state;
    let { node } = childState;
    const siblings = childStates.map(({ node }) => node);
    // we need to extend the path here to make it available for the childs children
    return {
      ...childState, events,
      path: path.concat([
        rhythmFraction(node, index, siblings, parent)
      ])
    };
  },
  function outer(state, parentState, childState) {
    // this function runs after the child has been processed
    // => here the child already ran through "before" + "mutate"
    let { events, node, path } = childState;
    const children = getRhythmChildren(node);
    if (!children) { // is Leaf
      const value = typeof node === 'object' && !Array.isArray(node) ? node.value : node;
      events = events.concat([
        { value, path, ...pathTimeDuration(path) }
      ])
    }
    return { ...state, events } // only pass on values
  }
]


declare type RhythmPlugin<T> = HierarchyReducerPlugin<RhythmShovel<T>>;


export function digRhythm(
  tree: RhythmNode<string>,
  plugins: RhythmPlugin<string>[] = []
) {
  const [dig, inner, outer] = rhythmicalPlugin;
  const [innerPlugins, outerPlugins] = groupPlugins(plugins);

  const { events } = reduceHierarchy<RhythmShovel<string>>(
    dig,
    plug(inner, ...innerPlugins),
    plug(outer, ...outerPlugins),
    {
      node: tree,
      events: [],
      path: [rhythmFraction(tree)] // start with root fraction = [0,duration,1]
    }
  );
  return events;
}
