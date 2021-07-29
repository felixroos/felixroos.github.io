import { rhythmFraction, Fraction, pathTimeDuration } from '../util';

export declare type StandardTree<T> = { data?: T, children?: StandardTree<T>[], [index: string]: any };
export declare type TreeReducer<T, A> = (accumulator: A, node: T) => A;
export declare type TreeBroker<T, A> = (a: A, b: A, node: T) => A

// this function enables reducing a tree
// reducer is called for each node => update accumulator
// broker is called for each child => decide which part of accumulator is global (pass on) and local (only downwards)
export function reduceTree<T, A>(
  reducer: TreeReducer<StandardTree<T>, A>,
  broker: TreeBroker<StandardTree<T>, A> = (now) => now,
  accumulator: A,
  tree: StandardTree<T>
): A {
  accumulator = reducer(accumulator, tree);
  if (!tree?.children) {
    return accumulator;
  }
  /* const goDeeper = (acc, child) => reduceTree(reducer, broker, acc, child);
  const breakOut = (acc, child) => broker(goDeeper(acc, child), acc, child) */
  return tree.children.reduce(
    (acc, child) => broker(
      // TBD find way to short wire this (partially apply reducer/broker before)
      reduceTree(reducer, broker, acc, child), acc, child
    ),
    accumulator
  )
}


export declare interface PathAccumulator<T> {
  parents?: StandardTree<T>[]
  path?: Fraction[],
}

// how to infer this function type without loosing generics?
const pathReducer = <T>(acc: PathAccumulator<T>, node: StandardTree<T>): PathAccumulator<T> => {
  // this reducer only works if the broker ignores parents + path!
  let { parents, path } = acc;
  const siblings = parents?.[0]?.children;
  const index = siblings?.indexOf(node) || 0;
  path = [...(path || []), rhythmFraction(node, index, siblings, parents?.[0])];
  return {
    parents: [node, ...(parents || [])],
    path
  }
}

export declare interface EventAccumulator<T> extends PathAccumulator<T> {
  events: Array<{ value: T, path?: Fraction[], time?: number, duration?: number }>
}

export const eventReducer = <T>({ events, ...acc }: EventAccumulator<T>, node: StandardTree<T>): EventAccumulator<T> => {
  const { parents, path } = pathReducer(acc, node);
  return {
    ...acc,
    events: events.concat(!node.children ? [{ value: node.data, path }] : []),
    parents, path
  }
};
export const eventBroker = <T>({ events }: EventAccumulator<T>, old: EventAccumulator<T>) => ({ ...old, events });

export const timeReducer = <T>({ events, ...acc }: EventAccumulator<T>, node: StandardTree<T>): EventAccumulator<T> => {
  const { parents, path } = pathReducer(acc, node);
  return {
    ...acc,
    events: events.concat(!node.children ? [{ value: node.data, ...pathTimeDuration(path) }] : []),
    parents, path
  }
};

export const flatz = (tree) => reduceTree<string, EventAccumulator<string>>(
  timeReducer,
  eventBroker,
  { events: [] },
  tree
).events;