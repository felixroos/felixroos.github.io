import { minIndex } from 'd3-array';
export declare type NodeID = string;
export declare type Connection = [source: NodeID | null, target: NodeID, value: number, h?: number];
export declare type ConnectionState = { open: Connection[], closed: Connection[], winner: string[] | false }
export declare type Target = [target: NodeID, value: number, h?: number];

export default function astar(
  startNodes: NodeID[],
  endNodes: NodeID[],
  getTargets: (source: NodeID) => Target[]
): any[] {
  let state: ConnectionState;
  while (!state?.winner) {
    state = openNext(startNodes, endNodes, getTargets, state);
  }
  return state.winner;
}

export function* generateAstar(
  startNodes: NodeID[],
  endNodes: NodeID[],
  getTargets: (source: NodeID) => Target[]
): Generator<ConnectionState, ConnectionState> {
  let state: ConnectionState = {
    open: startNodes.map(node => [null, node, 0]),
    closed: [],
    winner: false
  };
  yield state;
  while (true) {
    state = openNext(startNodes, endNodes, getTargets, state);
    if (state.winner) {
      return state;
    }
    yield state;
  }
}

export function openNext(
  startNodes: NodeID[],
  endNodes: NodeID[],
  getTargets: (source: NodeID) => Target[],
  state: ConnectionState = {
    open: startNodes.map(node => [null, node, 0]),
    closed: [],
    winner: false
  }
): ConnectionState {
  let { open, closed } = state;
  const getValue = (o) => o[2]; // + (o[3] || 0);
  const bestIndex = minIndex(open, getValue);
  const best = open[bestIndex];
  if (endNodes.includes(best[1])) {
    return { open, closed, winner: traceWinner(best) };
  }
  //closed.push(best);
  closed = closed.concat([best]);
  const [_, newSource, distance] = best;
  const connections: Connection[] = getTargets(newSource)
    .map(([target, value]): Connection => [newSource, target, distance + value]);

  open = [
    ...open.slice(0, bestIndex),
    ...connections,
    ...open.slice(bestIndex + 1)
  ]
    .filter(c => !closed.find(([_, target, v]) => target === c[1] && v <= getValue(c)))
  //.filter((c, i, o) => !o.find(([_, target, v], k) => i !== k && target === c[1] && v <= getValue(c)))

  return { open, closed, winner: false };

  function traceWinner(winner) {
    const path = [winner[0], winner[1]];
    if (!path[0]) {
      return [path[1]];
    }
    while (!startNodes.includes(path[0])) {
      const prev = closed.find((c) => c[1] === path[0]);
      path.unshift(prev[0]);
    }
    return path;
  }
}
