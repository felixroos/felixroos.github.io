import { Node, Parent } from 'unist';
import { editAST } from '../rhythmical/tree/editAST';


// AST transformer plugins

export function sequential(node, { isPost }) {
  if (isPost || !['sequential', 'cat', 'group'].includes(node.type)) {
    return node; // don't touch node if it's not sequential
  }
  const start = node.start ?? 0;
  const end = node.end ?? 1;
  let time = start ?? 0;
  const parentDuration = end - start;
  const totalDuration = node.children.reduce((total, child) => total + (child.duration || 1), 0);
  return {
    ...node,
    start,
    end,
    children: node.children.map((child) => {
      const duration = child.duration || 1;
      const start = time;
      const end = time + (duration / totalDuration) * parentDuration;
      time += end - start;
      // could also multiply with node.duration here
      return {
        ...child,
        start,
        end,
      };
    }),
  };
}

export function parallel(node, { isPost }) {
  if (isPost || !['parallel', 'stack', 'layers'].includes(node.type)) {
    return node; // don't touch node if it's not parallel
  }
  const start = node.start ?? 0;
  const end = node.end ?? 1;
  return {
    ...node,
    start,
    end,
    children: node.children.map((child) => ({
      ...child,
      start,
      end,
    })),
  };
}

export function onestep(node, state) {
  if (!['onestep'].includes(node.type)) {
    return node; // don't touch node if it's not a onestep
  }
  if (state.isPost) {
    state.branches.pop(); // commenting this out makes test not fail! write test with sibling branches
    // TODO: maybe just use product as whole number and multiply in pre and divide in post
    return node;
  }
  const start = node.start ?? 0; // default to 0 for root note
  const end = node.end ?? 1; // default to 1 for root note
  const factor = node.children[0].children.length; // onestep -> [seqential]
  state.branches ??= [];
  state.query ??= 0; // q
  const branchProduct = state.branches.reduce((acc, f) => f * acc, 1); // f
  state.branches.push(factor);
  const offset = node.index ?? 0; // i // TODO: find way to get index without having to pass it in
  // need sum of preceding indicies?
  const index = ((state.query - offset) / branchProduct) % factor; // q - i / f
  // console.log('onestep q=', state.query, 'i=', offset, 'f=', branchProduct, 'index =', index);
  return {
    ...node,
    start,
    end,
    children: [{ ...node.children[0].children[index], index, start, end }],
  };
}

export function string(node, state) {
  if (state.isPost || !['string', 'leaf'].includes(node.type)) {
    return node;
  }
  state.events ??= [];
  state.events.push(node);
  return node;
}

export const defaultPlugins = [sequential, parallel, onestep, string];
interface TransformState {
  [key: string]: any;
}

// plugin consumers

declare type TransformPlugin<T extends Node | Parent> = (node: T, state: TransformState) => T;
// these functions add start / end to the given node's children (only next layer!)
export function transform(ast, state: TransformState = {}, plugins: TransformPlugin<any>[] = defaultPlugins) {
  return editAST(ast, (node, traverseState) => {
    // throw node through all plugins in the order of the array (this is like ramda compose)
    return plugins.reduce((acc, plugin) => {
      Object.assign(state, traverseState); // mutate!
      return plugin(acc, state);
    }, node);
  });
}

// query

export function query(ast, n = 0, durationEvents = false) {
  const state = { events: [], query: n };
  transform(ast, state);
  if (durationEvents) {
    return transformEvents(state.events);
  }
  return state.events;
}

// transform events

export function transformEvents(events) {
  return events.map(({ start, end, ...event }) => ({
    time: start,
    duration: end - start,
    ...event,
  }));
}
