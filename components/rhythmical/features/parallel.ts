import { AgnosticChild, ValueChild, toObject, toArray } from '../helpers/objects';
import { max, sum } from 'd3-array';

// unifies to {value:[],type:'parallel'} if object with type parallel
export function parallelChild<T>(agnostic: AgnosticChild<T>): AgnosticChild<T> {
  if (typeof agnostic !== 'object') { // not default
    return agnostic;
  }
  const object = agnostic as ValueChild<T>;
  if (object.type === 'parallel' || object.parallel) {
    if (object.value && object.parallel) {
      throw new Error('cannot set value together with parallel');
    }
    object.value = object.parallel || object.value;
    object.type = 'parallel';
    delete object.parallel;
  }
  return object;
}

// sets parallel paths to children if type is parallel
export function parallelParent<T>(agnostic: AgnosticChild<T>): AgnosticChild<T> {
  const _parent = parallelChild<T>(agnostic) as ValueChild<T>;
  if (typeof _parent !== 'object' || _parent.type !== 'parallel') {
    return _parent;
  }
  const parent = toObject(_parent);
  const children = toArray(parent.value || []) as any;
  const durations = children.map((child) => toObject(child).duration ?? 1);
  const maxDuration = max(durations);
  return {
    ...parent, value: children.map((child: ValueChild<T>, index: number) => {
      child = toObject<T>(child);
      let path: [number, number, number];
      path = (parent.path || []).concat([
        [0, durations[index], maxDuration]
      ])
      return { ...child, path }
    })
  }
}