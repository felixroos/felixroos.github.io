import { reduceHierarchy, StateDigger, StateReducer } from './reduceHierarchy';
import { getRhythmChildren, pathTimeDuration, rhythmFraction, RhythmNode } from '../util';

// StateMutator

// this seems to be old..

declare interface RhythmShovel<T> {
  node: RhythmNode<T>,
  events: Array<{ value: RhythmNode<T>, path?: number[][], time: number, duration: number }>,
  path: number[][],
};

declare type RhythmicalPlugin<T> = [
  StateDigger<RhythmShovel<T>>, // resolves children states
  StateReducer<RhythmShovel<T>>, // runs on each state before accessing children
  StateReducer<RhythmShovel<T>>, // runs on each child state before going deeper
]

const rhythmicalBase: RhythmicalPlugin<string> = [
  function dig({ node, ...state }) {
    return getRhythmChildren(node)?.map(child => ({ ...state, node: child }));
  },
  function before(childState, parentState, brokeredState, index, childStates) {
    // this function runs before the child has been processed
    // => here we can pass data down to the children
    let { node: parent, events, path } = parentState;
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
  function after(childState, parentState) {
    // this function runs after the child has been processed
    // => here the child already ran through "before" + "mutate"
    let { events, node, path } = childState;
    const children = getRhythmChildren(node);
    if (!children) { // is Leaf
      events = events.concat([
        { value: node, path, ...pathTimeDuration(path) }
      ])
    }
    return { ...parentState, events } // only pass on values
  }
]

// THIS IS CURRENTLY UNTESTED! JUST FIXED THE TYPINGS SO FAR

export function digRhythm(tree: RhythmNode<string>, edit?: any[]) {
  const [digger, before, after] = rhythmicalBase;
  const { events } = reduceHierarchy<RhythmShovel<string>>(
    digger,
    before,
    after,
    {
      node: tree,
      events: [],
      path: [rhythmFraction(tree)] // start with root fraction = [0,duration,1]
    }
  )
  return events;
}
