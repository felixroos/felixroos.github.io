import { Parent, Node } from 'unist';
import Fraction from 'fraction.js';
import { EditAST, editAST, TraverseState } from '../rhythmical/tree/editAST';
import { mapAST } from '../rhythmical/tree/rhythmAST';

interface Arc {
  start: Fraction;
  end: Fraction;
}
export const simpleArc = (arc: Arc): string => `${arc.start.toFraction()} - ${arc.end.toFraction()}`;

export interface WithDuration extends Node {
  duration?: number;
}
// could narrow WithArc down to have type 'arc'
export interface WithArc extends Node {
  start: Fraction;
  end: Fraction;
}
export type WithProperties = WithDuration & WithArc; // properties that any node can have

export interface RhythmChild<T extends string> extends Node {
  type: T;
  value: string | number | boolean;
}
export interface RhythmParent<T extends string> extends Parent {
  type: T;
  children: RhythmNode[];
}
export type RhythmNode = (RhythmParent<'sequential' | 'sequence' | 'parallel' | 'arc'> | RhythmChild<'leaf' | 'arc'>) &
  Partial<WithProperties>;

export function sequence<T>(
  children: T[],
  duration: (child: T) => number = (child: T & WithDuration) => child.duration ?? 1,
  factor = 1
): Arc[] {
  const whole = children.reduce((total, child) => total + duration(child), 0);
  let time = new Fraction(0);
  return children.map((child) => {
    const part = duration(child) / whole;
    const arc = { start: time.mul(factor), end: time.add(part).mul(factor) };
    time = time.add(part);
    return arc;
  }, []);
}

export function sequentialToArc(node: RhythmNode, state: TraverseState): RhythmNode {
  if (node.type !== 'sequence') {
    return node;
  }
  if (state.isPost) {
    const children: Array<RhythmNode> = sequence(node.children, (node) => node.duration ?? 1).map((arc, i) => ({
      ...node.children[i],
      arc: simpleArc(arc),
      type: 'arc',
    }));
    return {
      ...node,
      type: 'arc',
      children,
    };
  }
  return node;
}

type EditRhythmAST = EditAST<RhythmNode>;

/* export function editRhythmAST(
  ast: RhythmNode,
  mapFn: (node: RhythmNode, state?: Partial<TraverseState>) => RhythmNode
): RhythmNode {
  return editAST<RhythmNode>(ast, mapFn);
} */

export function stack<T>(children: T[]): Arc[] {
  return children.map(() => ({ start: new Fraction(0), end: new Fraction(1) }));
}
