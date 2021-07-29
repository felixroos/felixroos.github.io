import { __, curry, pipe, map, flatten, compose, add } from 'ramda';
import { Scale, Note } from '@tonaljs/tonal';

// returns note of given scale
export const scale = name => Scale.get(name).notes

// returns pattern of indices inside array
export const pattern = curry(
  (indices, array) => indices.map(i => array[i % array.length])
)

// like pattern, but starting on index 1
export const degrees = curry((indices, array) => pattern(indices.map(i => i - 1), array));

// combination
export const scaleDegrees = curry((pattern, name) => degrees(pattern, scale(name)))

export const nestedDegrees = indices => map(i => indices.map(d => i + d - 1))

export const nest = curry((patterns, notes) => pipe(
  () => patterns[0],
  ...patterns.slice(1)
    .map(pattern => pipe(
      nestedDegrees(pattern),
      flatten
    )), degrees
)()(notes));

export const transpose = curry((interval, note) => Note.transpose(note, interval))

export const clark = (...[tonic, _scale]) => ({
  duration: 12,
  sequential: [
    {
      duration: 7,
      sequential: nest(
        [
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 1]
        ],
        [
          ...scale(`${tonic} ${_scale}`),
          ...scale(`${Note.transpose(tonic, '8P')} ${_scale}`)
        ]
      )
    },
    Note.transpose(tonic, '8P')
  ]
})


/*
{
  scale: 'C major',
  sequential: [1, 4, 5],
  map: leaf => { parallel: [1, 3, 5] }
}

{
  scale: 'C major',
  sequential: [
    { duration: 7,
      sequential: [1,2,3,4,5,6,7],
      pattern: [1,2,3,1]
    },
    8
  ]
}
// turns into
{
  scale: 'C major',
  sequential: [
    {
    duration: 7,
    sequential: [
      [1,2,3,1],
      [2,3,4,2],
      [3,4,5,3],
      [4,5,6,4],
      [5,6,7,5],
      [6,7,8,6],
      [7,8,9,7]
    ]},
    8
  ]
}
// pattern essentially maps and adds:
// [1,2,3,4,5,6,7].map(i => [1,2,3,1].map(d=>d+i-1))
// BUT: this will not work if the patterns are rhythmical objects
// => this will need the non existing tree mapping function
// => this would also allow to nest patterns inside patterns !

{
  sequence: [
    [1,2],
    [3]
  ]
}

*/

// TBD: run reducers in pipe
// TBD: imagine how tree map would work with pipes
// TBD: find out how to nest patterns parallel and sequential
// TBD: find out how to use patterns like [1,3,5,8] with correct octaves (infinite list?!)
// TBD: what about negative degrees/indices?
