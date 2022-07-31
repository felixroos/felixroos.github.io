import { toArray, toObject, AgnosticChild } from '../helpers/objects';
import { curry } from 'ramda';
// import { zip } from 'zippa';
// import { walkRhythm } from '../tree/RhythmZipper';

export function inheritProperty<T>(property) {
  return (_parent: AgnosticChild<T>): AgnosticChild<T> => {
    const parent = toObject(_parent);
    if (!parent[property] || !parent.value) {
      return parent;
    }
    return {
      ...parent, value: (toArray(parent.value)).map(child => {
        const childObj = toObject(child);
        return { ...childObj, [property]: childObj[property] || parent[property] }
      })
    }
  }
}

export function inherit(property) {
  return ({ child, parent }) => {
    if (child?.[property] ?? parent?.[property]) {
      return { ...child, [property]: child[property] ?? parent[property] };
    }
    return child;
  }
}

function objectify(item) {
  if (Array.isArray(item)) {
    return { sequential: item }
  } else if (typeof item === 'object') {
    return item;
  }
  return { value: item };
}

// this is the new shit
/* export const inheritProp = curry((property, rhythm) => walkRhythm(
  zipper => {
    const parentValue = zipper.up?.()?.value();
    if (parentValue?.[property] === undefined) {
      return zipper
    }
    return zip.edit(item => {
      const childObj = objectify(item);
      return { ...childObj, [property]: childObj[property] ?? parentValue?.[property] };
    })(zipper)
  },
  rhythm
))

export default inheritProp; */