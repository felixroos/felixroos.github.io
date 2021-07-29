export declare type StateReducer<S> = (brokeredState: S, parentState?: S, childState?: S, index?: number, childStates?: S[]) => S
export declare type StateDigger<S> = (state: S) => S[] | undefined

export function reduceHierarchy<S>(
  dig: StateDigger<S>, // resolves children states
  inner: StateReducer<S>, // runs on each child state before going deeper
  outer: StateReducer<S>, // runs on each child state after going deeper
  state: S, // state with hierarchical data
  // the following arguments are "private"
  _childState?: S,
  _parentState?: S,
  _index?: number,
  _childStates?: S[]
): S {
  state = inner(state, _parentState, _childState, _index, _childStates);
  const children = dig(state); // dig children after reducer call to be able to generate new children
  if (!children?.length) {
    return state;
  }
  return children.reduce((brokeredState, childState, index, children) => outer(
    reduceHierarchy(dig, inner, outer, childState,
      state, brokeredState, index, children
    ),
    _parentState,
    brokeredState,
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

export function groupPlugins<S>(plugins: HierarchyReducerPlugin<S>[]): [StateReducer<S>[], StateReducer<S>[]] {
  const I = (s) => s;
  return plugins.reduce(
    ([ins, outs], [inner, outer]) => {
      return [ins.concat(inner || I), outs.concat(outer || I)]
    }, [[], []])
}


// plugins

