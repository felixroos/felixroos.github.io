import { getTimeDuration, flatRhythmObject, renderRhythm } from './rhythmical';
import { flatRhythmArray } from './deprecated';
// import { flatRhythmObject } from './deprecated'; // also works, but bad code
import { toObject } from './helpers/objects';
import { inherit } from './features/inherit';

test('getTimeDuration', () => {
  expect(getTimeDuration([[0, 1, 2]])).toEqual([0, 0.5])
  expect(getTimeDuration([[1, 1, 2]])).toEqual([0.5, 0.5])
  expect(getTimeDuration([[0, 1, 2], [0, 1, 2]])).toEqual([0, 0.25])
  expect(getTimeDuration([[0, 1, 2], [1, 1, 2]])).toEqual([0.25, 0.25])
  expect(getTimeDuration([[1, 1, 2], [0, 2, 2]])).toEqual([0.5, 0.5])
})

function flattenTests(flatten) {
  expect(flatten('A')).toEqual([{ value: 'A', path: [[0, 1, 1]] }])
  expect(flatten(['A', 'B'])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2]] }])
  expect(flatten(['A', ['B']])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 1]] }])
  expect(flatten(['A', ['B', 'C']])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatten({ value: ['A', ['B', 'C']] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatten({ sequential: ['A', ['B', 'C']] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatten({ sequential: ['A', { value: ['B', 'C'] }] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatten({ sequential: ['A', { sequential: ['B', 'C'] }] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatten({ parallel: ['B', 'C'] })).toEqual([{ value: 'B', path: [[0, 1, 1]] }, { value: 'C', path: [[0, 1, 1]] }])
  expect(flatten([{ parallel: ['A', 'B'] }])).toEqual([{ value: 'A', path: [[0, 1, 1], [0, 1, 1]] }, { value: 'B', path: [[0, 1, 1], [0, 1, 1]] }])
  // polyphony
  expect(flatten({
    sequential: [
      { parallel: ['C3', 'E3'], color: 'white' },
      { parallel: ['D3', 'F3'], color: 'gray' },
      { parallel: ['E3', 'G3'], color: 'steelblue' }
    ]
  })).toEqual(
    [{ "value": "C3", "path": [[0, 1, 3], [0, 1, 1]], "color": "white" }, { "value": "E3", "path": [[0, 1, 3], [0, 1, 1]], "color": "white" }, { "value": "D3", "path": [[1, 1, 3], [0, 1, 1]], "color": "gray" }, { "value": "F3", "path": [[1, 1, 3], [0, 1, 1]], "color": "gray" }, { "value": "E3", "path": [[2, 1, 3], [0, 1, 1]], "color": "steelblue" }, { "value": "G3", "path": [[2, 1, 3], [0, 1, 1]], "color": "steelblue" }]
  );
  expect(flatten({
    parallel: [
      { sequential: ['E3', 'F3', 'G3'], color: 'white' },
      { sequential: ['C3', 'D3', 'E3'], color: 'gray' }
    ]
  })).toEqual([{ "value": "E3", "path": [[0, 1, 1], [0, 1, 3]], "color": "white" }, { "value": "F3", "path": [[0, 1, 1], [1, 1, 3]], "color": "white" }, { "value": "G3", "path": [[0, 1, 1], [2, 1, 3]], "color": "white" }, { "value": "C3", "path": [[0, 1, 1], [0, 1, 3]], "color": "gray" }, { "value": "D3", "path": [[0, 1, 1], [1, 1, 3]], "color": "gray" }, { "value": "E3", "path": [[0, 1, 1], [2, 1, 3]], "color": "gray" }])
  expect(toObject({ parallel: 'C' })).toEqual({ parallel: 'C' });
  const twoChords = [
    { value: "C", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "E", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "G", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "D", path: [[1, 1, 2], [0, 1, 1]] },
    { value: "F", path: [[1, 1, 2], [0, 1, 1]] },
    { value: "A", path: [[1, 1, 2], [0, 1, 1]] }
  ];
  expect(flatten([
    { parallel: ['C', 'E', 'G'] },
    { parallel: ['D', 'F', 'A'] },
  ]
  )).toEqual(twoChords)
  expect(flatten([
    { value: ['C', 'E', 'G'], type: 'parallel' },
    { value: ['D', 'F', 'A'], type: 'parallel' },
  ]
  )).toEqual(twoChords)
  expect(flatten(['C', ['D', 'E']]))
    .toEqual([
      { value: "C", path: [[0, 1, 2]] },
      { value: "D", path: [[1, 1, 2], [0, 1, 2]] },
      { value: "E", path: [[1, 1, 2], [1, 1, 2]] }
    ])
  expect(flatten(
    { value: ['C', 'E', 'G'], type: 'parallel' },
  ))
    .toEqual([
      { value: "C", path: [[0, 1, 1]] },
      { value: "E", path: [[0, 1, 1]] },
      { value: "G", path: [[0, 1, 1]] }
    ])
  expect(flatten(
    { parallel: ['C', 'E', 'G'] },
  ))
    .toEqual([
      { value: "C", path: [[0, 1, 1]] },
      { value: "E", path: [[0, 1, 1]] },
      { value: "G", path: [[0, 1, 1]] }
    ])
}

test('flatRhythmObject', () => {
  flattenTests(flatRhythmObject);
  // moved those two tests out of flattenTests
  expect(flatRhythmObject([{ value: 'C', duration: 2 }, ['D', 'E']]))
    .toEqual([
      { value: "C", path: [[0, 2, 3]], duration: 2 },
      { value: "D", path: [[2, 1, 3], [0, 1, 2]] },
      { value: "E", path: [[2, 1, 3], [1, 1, 2]] }
    ])
  expect(flatRhythmObject({ duration: 2, value: [{ value: 'C', duration: 2 }, ['D', 'E']] }))
    .toEqual([
      { value: "C", path: [[0, 2, 3]], duration: 2 },
      { value: "D", path: [[2, 1, 3], [0, 1, 2]] },
      { value: "E", path: [[2, 1, 3], [1, 1, 2]] }
    ])
})

/* test('renderRhythm', () => {
  // customize renderRhythm so that the output is similar to flatRhythmObject (to repeat old tests)
  const flatten = (o) => renderRhythm(o, [inherit('color')]).map(e => {
    delete e.time
    delete e.duration
    e.path = e.path.slice(1);
    return e;
  })
  flattenTests(flatten);
  // TBD test time / duration + plugins
}) */

test('flatRhythmArray', () => {
  expect(flatRhythmArray(['C', 'D'])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.5 },
  ])
  expect(flatRhythmArray(['C', ['D', 'E']])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.25 },
    { value: 'E', time: 0.75, duration: 0.25 },
  ])
})



test('flatRhythmArray', () => {
  expect(flatRhythmArray(['C', 'D'])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.5 },
  ])
  expect(flatRhythmArray(['C', ['D', 'E']])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.25 },
    { value: 'E', time: 0.75, duration: 0.25 },
  ])
})


/* const octaveChildren = walkNodes(
  pipe(until(isLeaf, next), edit(x => x + '5'))
)

const zipper = RhythmZipper.from({
  parallel: [
    ['a', 'b', 'c'],
    {
      sequential: ['d', ['e', 'f']]
    }
  ]
});

console.log(octaveChildren(zipper).value()); */