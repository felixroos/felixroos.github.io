import { Collection } from '@tonaljs/tonal';

export function rotate({ child }) {
  if (!child.rotate) {
    return child;
  }
  return { ...child, value: Collection.rotate(child.rotate, child.value) };
}