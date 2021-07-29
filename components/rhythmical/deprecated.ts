// All this code is garbage as the features are fragmented into too many functions
// also, the feature modularity does not work without mutating the parent...

import { AgnosticChild, toObject, ValueChild, flatObject, toArray } from './helpers/objects';
import { getTimeDuration, sumDurations } from './rhythmical';
import { max } from 'd3-array';
import { NestedArray, flatArray } from './helpers/arrays';

const types = { sequential: 'sequential', parallel: 'parallel' };

export type ChildFeature<T> = (parent: ValueChild<T>) => (child: AgnosticChild<T>, i?: number) => AgnosticChild<T> | undefined;

export function ensureValue<T>(o: ValueChild<T>, type) {
  // this is mutable
  if (o[type]) {
    o.type = type;
    o.value = o[type];
    delete o[type];
  }
  return o;
}

// calculate paths is sequential fashion
export function sequentialPath<T>(parent: ValueChild<T>) {
  /* if (!isType(parent, types.sequential, true)) {
    return;
  } */
  parent = ensureValue<T>(parent, 'sequential');
  let { value: parentValue, type: parentType, path: parentPath } = parent;
  const children = (toArray(parentValue) || []);
  const duration = sumDurations(children);
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'sequential');
    let path: [number, number, number];
    if (!parentType || parentType === types.sequential) {
      const position = sumDurations(children.slice(0, i))
      path = (parentPath || []).concat([
        [position, child.duration || 1, duration]
      ])
      return { ...child, path }
    }
    return child;
  }
}

// calculates paths in absolute fashion
export function parallelPath<T>(parent: ValueChild<T>) {
  /* if (!isType(parent, types.parallel)) {
    return;
  } */
  parent = ensureValue<T>(parent, 'parallel');
  let { value: parentValue, type: parentType, path: parentPath } = parent;
  const children = (toArray(parentValue) || []);
  const maxDuration = max(children.map(c => toObject(c).duration || 1));
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'parallel');
    let path: [number, number, number];
    if (parentType === types.parallel) {
      path = (parentPath || []).concat([
        [0, (parent.duration || 1), maxDuration]
      ])
      return { ...child, path }
    }
    return child;
  }
}

// passes down color, can override parent color
export function colorProperty<T>(parent: ValueChild<T>) {
  let { color: parentColor } = parent;
  return (child: ValueChild<T>) => {
    if (child.color || parentColor) {
      child = { ...child, color: child.color || parentColor };
    }
    return child;
  }
}


// flatten rhythmical object format to events with features
export function flatRhythmObject<T>(agnostic: AgnosticChild<T>, features: ChildFeature<T>[] = [
  sequentialPath,
  parallelPath,
  colorProperty,
]): ValueChild<T>[] {
  return flatObject(agnostic, {
    getChildren: (agnostic: AgnosticChild<T>) => {
      let o = toObject<T>(agnostic);
      const transforms = features.map(f => f(o)).filter(t => !!t); // o is mutated here...
      let { value: parentValue } = o;
      const children = (toArray(parentValue) || []);
      return children.map((child, i) => {
        child = toObject<T>(child);
        transforms.forEach(transform => {
          child = transform(child, i)
        });
        return child;
      });
    }
  });
}


// calculate time + duration for flat events with paths
export function renderRhythmObject<T>(agnostic: AgnosticChild<T>) {
  const root = toObject(agnostic);
  const totalDuration = 1 / (root.duration || 1); // outer duration
  return flatRhythmObject(agnostic).map((event) => {
    let { path } = event;
    path = [[0, totalDuration, totalDuration]].concat(path);
    const [time, duration] = getTimeDuration(path);
    return ({ ...event, time, duration, path })
  })
}

/* export function unifyValue<T>(parent: ValueChild<T>) {
  function unifyByType(o: AgnosticChild<T>) {
    const object = toObject(o);
    ['parallel', 'sequential'].forEach(type => {
      if (object[type]) {
        object.value = o[type];
        object.type = type;
      }
    });
    return object;
  }
  let { value: parentValue, type: parentType, path: parentPath } = unifyByType(parent);
  const children = (toArray(parentValue) || []);
  const duration = sumDurations(children);
  return (child: ValueChild<T>, i: number) => {
    child = ensureValue<T>(child, 'sequential');
    let path: [number, number, number];
    if (!parentType || parentType === types.sequential) {
      const position = sumDurations(children.slice(0, i))
      path = (parentPath || []).concat([
        [position, child.duration || 1, duration]
      ])
      return { ...child, path }
    }
    return child;
  }
} */
/* export function isType<T>(child: AgnosticChild<T>, type: string, isDefault = false): boolean {
  if (typeof child !== 'object' || Array.isArray(child)) {
    return isDefault;
  }
  const _type = (child as ValueChild<T>).type;
  return _type === type || (!type && isDefault);
}
 */


// 
export function flatRhythmArray<T>(array: NestedArray<T>, whole = 1, keepPath = false) {
  return flatArray(array).map(({ value, path }) => {
    let [time, duration] = getTimeDuration(path);
    return { value, time, duration, ...(keepPath ? { path } : {}) };
  })
}

export interface MusicObject<T> {
  m?: Music<T>[] | Music<T>; // monophony
  p?: Music<T>[] | Music<T>; // polyphony
  value?: Music<T>[]; // generic
  path?: [number, number, number][];
}
export type Music<T> = T | T[] | MusicObject<T>;



export declare type StateReducer<S> = (brokeredState: S, parentState?: S, childState?: S, index?: number, childStates?: S[]) => S
export declare type StateDigger<S> = (state: S) => S[] | undefined

export function reduceHierarchy<S>(
  dig: StateDigger<S>, // resolves children states
  inner: StateReducer<S>, // runs on each child state before going deeper
  outer: StateReducer<S>, // runs on each child state after going deeper
  state: S, // state with hierarchical data
  // the following arguments are "private"
  _parentState?: S,
  _childState?: S,
  _index?: number,
  _childStates?: S[]
): S {
  state = inner(state, _parentState, _childState, _index, _childStates);
  const children = dig(state); // dig children after reducer call to be able to generate new children
  if (!children?.length) {
    return state;
  }
  return children.reduce((brokeredState, childState, index, children) => outer(
    brokeredState,
    _parentState,
    reduceHierarchy(dig, inner, outer,
      brokeredState, state, childState, index, children
    ),
    index, children
  ), state)
  /* return children.reduce((brokeredState, childState, index, children) => outer(
    brokeredState,
    _parentState,
    reduceHierarchy(dig, inner, outer, brokeredState,
      state, childState, index, children
    ), index, children
  ), state) */
}

// allows combining multiple state brokers
export function plug<S>(...brokers: StateReducer<S>[]): StateReducer<S> {
  return brokers.reduce((reduced, broker) => {
    return (...[state, ...args]) => broker(reduced(state, ...args), ...args)
  }, (...[state]) => state)
}

export declare type HierarchyReducerPlugin<S> = [/* inner: */ StateReducer<S>, /* outer: */ StateReducer<S>];

export function groupPlugins<S>(plugins: HierarchyReducerPlugin<S>[] = []): [StateReducer<S>[], StateReducer<S>[]] {
  const I = (s) => s;
  return plugins.reduce(
    ([ins, outs], [inner, outer]) => {
      return [ins.concat(inner || I), outs.concat(outer || I)]
    }, [[], []])
}


// plugins

import { Chord, Note } from '@tonaljs/tonal';
import { voicingsInRange } from './voicings/voicingsInRange';

export const topNoteSort = (events) => {
  const lastNote = events[events.length - 1].value; // last voiced note (top note)
  // calculates the distance between the last note and the given voicings top note
  const diff = (voicing) => Math.abs(Note.midi(lastNote) - Note.midi(voicing[voicing.length - 1]));
  // sort voicings by lowest top note difference
  return (a, b) => diff(a) - diff(b);
}

export const voicings = (dictionary, range, sorter = topNoteSort) => (events, event) => {
  if (typeof event.value !== 'string') {
    return events
  }
  let voicings = voicingsInRange(event.value, dictionary, range);
  const { tonic, aliases } = Chord.get(event.value);
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!symbol) {
    console.log(`no voicings found for chord "${event.value}"`);
    return events;
  }
  let notes;
  const lastVoiced = events.filter(e => !!e.chord);
  if (!lastVoiced.length) {
    notes = voicings[Math.ceil(voicings.length / 2)];
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    notes = voicings.sort(sorter(lastVoiced))[0];
  }
  return events.concat(notes.map((note) => ({ ...event, value: note, chord: event.value })));
}
