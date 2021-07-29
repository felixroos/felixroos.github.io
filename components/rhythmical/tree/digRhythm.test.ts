import { digRhythm } from './reduceRhythm';
import { RhythmNode } from '../util';

test('digRhythm', () => {
  expect(digRhythm({
    duration: 4,
    sequential: ['D3', ['F3', 'A3']],
  }).map((({ value, time, duration }) => ({ value, time, duration }))
  )).toEqual([
    { value: 'D3', time: 0, duration: 2 },
    { value: 'F3', time: 2, duration: 1 },
    { value: 'A3', time: 3, duration: 1 },
  ])

  const rhythm: RhythmNode<string> = {
    duration: 6,
    sequential: ['D3', ['F3', 'A3'], 'Cm7'],
  };
  const dug = digRhythm(rhythm, [(shovel) => {
    if (shovel.node === 'Cm7') {
      return {
        ...shovel,
        node: {
          parallel: ['C3', 'Eb3', 'G3', 'Bb3']
        }
      }
    }
    return shovel
  }])
  expect(dug
    .map((({ value, time, duration }) => ({ value, time, duration }))
    )).toEqual([
      { value: 'D3', time: 0, duration: 2 },
      { value: 'F3', time: 2, duration: 1 },
      { value: 'A3', time: 3, duration: 1 },
      { value: 'C3', time: 4, duration: 2 },
      { value: 'Eb3', time: 4, duration: 2 },
      { value: 'G3', time: 4, duration: 2 },
      { value: 'Bb3', time: 4, duration: 2 },
    ])
});
