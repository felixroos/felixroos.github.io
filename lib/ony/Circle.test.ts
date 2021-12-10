import Circle from './Circle';
import { steps } from './Step';

test('Circle', () => {
  expect(Circle(['A', 'B', 'C']).first).toEqual('A');
  expect(Circle(['A', 'B', 'C']).index(-1)).toEqual(2);
  expect(Circle(['A', 'B', 'C']).index(-2)).toEqual(1);
  expect(Circle(['A', 'B', 'C']).index(-3)).toEqual(0);
  expect(Circle(['A', 'B', 'C']).index(-4)).toEqual(2);
  expect(Circle(['A', 'B', 'C']).invert().item(0)).toEqual('A');
  expect(Circle(['A', 'B', 'C']).invert().item(1)).toEqual('C');
  expect(Circle(['A', 'B', 'C']).item(0)).toEqual('A');
  expect(Circle(['A', 'B', 'C']).item(-1)).toEqual('C');
  expect(Circle(['A', 'B', 'C']).item(-3)).toEqual('A');
  expect(Circle(['A', 'B', 'C']).item(2)).toEqual('C');
  expect(Circle(['A', 'B', 'C']).item(3)).toEqual('A');
  expect(Circle(['A', 'B', 'C']).rotate(1).first).toEqual('B');
  expect(Circle(['A', 'B', 'C']).rotate(1).items).toEqual(['B', 'C', 'A']);
  expect(Circle(['A', 'B', 'C']).rotate(-1).first).toEqual('C');
  expect(Circle(['A', 'B', 'C']).rotate(-1).items).toEqual(['C', 'A', 'B']);
  expect(Circle(steps).index(-3)).toBe(9);
});
