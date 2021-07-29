import { indexPathString, pathString } from '../util';
import { editRhythm, editRhythmState } from './editRhythm'

test('editRhythm', () => {
  expect(editRhythm({ sequential: ['A', ['B', 'C'], 'D'] }, (node) => {
    if (typeof node !== 'string') {
      return node;
    }
    return node + '3';
  })).toEqual({ sequential: ['A3', ['B3', 'C3'], 'D3'] })

  expect(editRhythm({ sequential: ['A', ['B', 'C'], 'D'] }, (node, path) => {
    if (typeof node !== 'string') {
      return node;
    }
    return node + indexPathString(path);
  })).toEqual({ sequential: ['A0', ['B1:0', 'C1:1'], 'D2'] })
})


test('editRhythmState', () => {
  const [, { events }] = editRhythmState({ duration: 3, sequential: ['A', ['B', 'C'], 'D'] },
    { events: [], path: [] }, ([node]) => {
      if (typeof node !== 'string') {
        return node;
      }
      return node + '3';
    });
  expect(events).toEqual([
    { "duration": 3, "time": 0, "value": undefined },
    { "duration": 1, "time": 0, "value": "A" },
    { "duration": 1, "time": 1, "value": undefined },
    { "duration": 0.5, "time": 1, "value": "B" },
    { "duration": 0.5, "time": 1.5, "value": "C" },
    { "duration": 1, "time": 2, "value": "D" }])
})




