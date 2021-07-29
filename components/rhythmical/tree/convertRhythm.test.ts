
import { convertRhythm } from './convertRhythm';

test('convertRhythm', () => {
  expect(convertRhythm({ sequential: ['A', ['B', 'C'], 'D'] }, (node) => {
    if (typeof node !== 'string') {
      return node;
    }
    return node + '3';
  })).toEqual({ sequential: ['A3', ['B3', 'C3'], 'D3'] })
})

