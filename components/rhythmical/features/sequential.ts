
// unifies items to {value:[]}

import { AgnosticChild, ValueChild, toObject, toArray } from '../helpers/objects';
import { Feature, sumDurations } from '../rhythmical';
import { sum } from 'd3-array';

// arrays and primitives as well as objects without another type will be transformed
export function sequentialChild<T>(_item: AgnosticChild<T>): ValueChild<T> {
  const item = toObject(_item);
  if (item.type && item.type !== 'sequential') {
    return item;
  }
  if (!item.value && !item.sequential) {
    return item;
  }
  if (item.value && item.sequential) {
    throw new Error('cannot set value together with sequential');
  }
  const value = item.sequential || item.value;
  delete item.sequential;
  return { ...item, value } as ValueChild<T>;
}

// sets sequential paths for children if parent type is sequential
export function sequentialParent<T>(agnostic: AgnosticChild<T>, childFeatures: Feature<T>[] = []): AgnosticChild<T> {
  const parent = sequentialChild<T>(agnostic) as ValueChild<T>;
  if (!parent.value) {
    return parent;
  }
  const children = toArray(parent.value || []) as AgnosticChild<T>[];
  const durations = children.map((child) => toObject(child).duration ?? 1);
  const total = sum(durations); // / parentDuration;
  return {
    ...parent, value: children.map((child: AgnosticChild<T>, index: number) => {
      const position = sum(durations.slice(0, index))
      child = toObject<T>(child);
      let path: [number, number, number];
      path = (parent.path || []).concat([
        [position, durations[index], total]
      ])
      return { ...child, path }
    })
  }
}