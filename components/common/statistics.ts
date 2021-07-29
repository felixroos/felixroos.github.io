import { min, max } from 'd3-array';

// returns normalization function that scales numbers from 0 to 1 inside min max
export const normalizeNumbers = (set: number[]) => {
  // calculate min max outside mapping function
  const [start, end] = [min(set), max(set)];
  return (value: number) => (value - start) / (end - start);
};

// normalizes numeral values of property in set
export const normalizeProperty = (property: string, set: any[]) => {
  const normalizer = normalizeNumbers(set.map((item) => item[property]));
  return set.map((item) => ({
    ...item,
    [property]: normalizer(item[property])
  }));
};

// normalizes numeral values of property in set
// 2 in 1 function
/* export const normalizeProperty = (property: string, set: any[]) => {
  const values = set.map((item) => item[property]);
  const [start, end] = [min(values), max(values)];
  return set.map((item) => ({
    ...item,
    [property]: (item[property] - start) / (end - start)
  }));
}; */
