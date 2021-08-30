import { editTree } from './editTree';
import { getRhythmChildren, makeRhythmParent, Path, RhythmEvent, rhythmEvent, rhythmFraction, RhythmNode } from '../util';

export function editRhythm<T>(rhythm: RhythmNode<T>, before?, after?) {
  let path = [];
  return editTree<RhythmNode<T>>(
    getRhythmChildren,
    makeRhythmParent,
    (r, i, _, parent) => {
      i >= 0 && path.push(i);
      return before ? before(r, path, parent) : r;
    },
    (r, i) => {
      r = after ? after(r, path, parent) : r;
      i >= 0 && path.pop();
      return r;
    },
    rhythm
  );
}


// used by generateVoicings
// pro: easy to read
// contra: impure before / after  

declare type RhythmState<T> = { events?: RhythmEvent<T>[], path?: Path }

// this is kind of clunky :-/

export function editRhythmState<T>(rhythm: RhythmNode<T>, state: RhythmState<T>, before?) {
  // removed before, after params
  return editTree<[RhythmNode<T>, RhythmState<T>]>(
    // here we pass parent state down to children (events should be empty..)
    ([rhythm, state]) => {
      // console.log('getChildren', state);
      return getRhythmChildren(rhythm)?.map((child) => [child, state]) // + n
    },
    // here we pass reduce children states up to parent (just events)
    ([parent, state], children) => {
      // console.log('makeParent');
      return [
        makeRhythmParent(
          parent,
          children.map(([child]) => child) // + n
        ),
        { ...state, events: children.reduce((e, [c, s]) => [...e, ...s.events], []) }, // + n
      ]
    },
    // here we add the child fraction to the parent path
    ([child, state], i, c, [parent, parentState] = [undefined, state]) => {
      // console.log('node', node, parentNode);
      // console.log('before');
      state = { ...parentState, path: parentState.path.concat([rhythmFraction(child, i, c, parent)]) };
      before?.([child, state], i, c, [parent, parentState]);
      return [child, state]; // expected format
    },
    // here we add the child event to the child state (which is reduced in makeParent)
    (node, i, _, [parent, parentState] = [undefined, state]) => {
      // console.log('after');
      let [child, state] = node;
      state = { ...parentState, events: [rhythmEvent(child, state.path), ...state.events] }; // state.events contains reduced child events
      // no need to pop path => just don't pass path to parent
      return [child, state];
    },
    [rhythm, state]
  );
}

export function editRhythmImmutable<T, S>(rhythm: RhythmNode<T>, state: S, before, after?) {
  return rhythm;
}
