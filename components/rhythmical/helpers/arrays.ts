export interface NestedArray<T> extends Array<T | NestedArray<T>> { }
export type Path = [number, number, number];
export type FlatItem<T> = { value: T, path: Path[] };

export function flatArray<T>(array: NestedArray<T>, path: Path[] = [], flat: FlatItem<T>[] = []): FlatItem<T>[] {
  for (let i = 0; i < array.length; i++) {
    let value, duration;
    if (Array.isArray(array[i]) || typeof array[i] !== 'object') {
      value = array[i];
      duration = 1;
    } else {
      value = array[i]['value'];
      duration = array[i]['duration'] || 1;
    }
    if (typeof value !== 'object') {
      flat.push({ value, path: path.concat([[i, duration, array.length]]) })
    } else if (Array.isArray(value)) {
      flatArray(value as NestedArray<T>, path.concat([[i, duration, array.length]]), flat)
    }
  }
  return flat;
}

export function nestArray<T>(items: FlatItem<T>[], fill: any = 0): NestedArray<T> {
  return items.reduce((nested, item) => {
    let [index, duration, subdivision] = item.path[0];
    if (index >= subdivision) {
      console.error(`invalid path ${item.path[0]} on item`, item);
      return nested;
    }
    if (nested.length && nested.length < subdivision) {
      console.warn(
        'ivalid flat array: different divisions on same level > concat',
        items,
        nested
      );
      nested = nested.concat(
        (new Array(subdivision - nested.length) as any).fill(fill)
      );
    }
    if (nested.length && nested.length > subdivision) {
      console.warn(
        'flat array: different divisions on same level',
        items,
        nested
      );
    }
    if (!nested.length && subdivision) {
      nested = (new Array(subdivision) as any).fill(fill);
    }
    if (item.path.length === 1) {
      if (Math.round(index) === index) {
        nested[index] = item.value;
      } else if (item.value !== fill) {
        console.warn(
          'fractured path! value "' + item.value + '" !== "' + fill + '"',
          item
        );
      }
    } else {
      nested[index] = nestArray(
        items
          .filter(i => i.path.length > 1 && i.path[0][0] === index)
          .map(i => ({ ...i, path: i.path.slice(1) })),
        fill
      );
    }
    return nested;
  }, []);
}