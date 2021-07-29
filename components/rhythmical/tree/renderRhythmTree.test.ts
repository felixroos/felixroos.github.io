import { lefthand } from './../voicings/dictionary';
import { Chord } from '@tonaljs/tonal';
import { getRhythmChildren, makeRhythmParent, toRhythmObject } from '../util';
import { Voicing, VoiceLeading } from '../voicings/Voicing';
const { topNoteDiff } = VoiceLeading;
import renderRhythmTree from './renderRhythmTree';
const simplify = ({ value, time, duration }) => [value, time, duration];

test('variable durations', () => {
  expect(renderRhythmTree({
    duration: 8, sequential: [
      [{ value: "C4", duration: 3 }, "D4"],
      ["E4", { value: "D4", duration: 2 }, "B3"]]
  }).map(simplify)).toEqual([
    ['C4', 0, 3],
    ['D4', 3, 1],
    ['E4', 4, 1],
    ['D4', 5, 2],
    ['B3', 7, 1],
  ]);
})
test('nested array', () => {
  expect(renderRhythmTree({
    duration: 9,
    sequential: [
      [
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', 'sn'],
      ],
      [
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', ['sn', 'sn', 'sn']],
        [
          ['sn', 'sn', 'sn'],
          ['sn', 'sn', 'sn'],
        ],
      ],
    ]
  }).map(simplify)).toEqual([
    ["sn", 0, 0.75],
    ["sn", 0.75, 0.25],
    ["sn", 1, 0.25],
    ["sn", 1.25, 0.25],
    ["sn", 1.5, 0.75],
    ["sn", 2.25, 0.25],
    ["sn", 2.5, 0.25],
    ["sn", 2.75, 0.25],
    ["sn", 3, 0.75],
    ["sn", 3.75, 0.75],
    ["sn", 4.5, 0.75],
    ["sn", 5.25, 0.25],
    ["sn", 5.5, 0.25],
    ["sn", 5.75, 0.25],
    ["sn", 6, 0.75],
    ["sn", 6.75, 0.25],
    ["sn", 7, 0.25],
    ["sn", 7.25, 0.25],
    ["sn", 7.5, 0.25],
    ["sn", 7.75, 0.25],
    ["sn", 8, 0.25],
    ["sn", 8.25, 0.25],
    ["sn", 8.5, 0.25],
    ["sn", 8.75, 0.25]
  ])
});

test('polyphony', () => {
  expect(renderRhythmTree({
    duration: 4,
    parallel: [
      ['C', ['D', 'E']],
      ['E', ['G', 'B']],
    ]
  }).map(simplify)).toEqual([
    ['C', 0, 2],
    ['D', 2, 1],
    ['E', 3, 1],
    ['E', 0, 2],
    ['G', 2, 1],
    ['B', 3, 1],
  ])
})

const mutateStringLeaf = (mutateFn) => (node) => {
  const o = toRhythmObject(node);
  const { value } = o;
  if (typeof value !== 'string') {
    return node;
  }
  return mutateFn(value, node);
};

test('times', () => {
  expect(renderRhythmTree({
    duration: 5,
    sequential: ['hh*3', 'sn*2']
  }, ({ children }) => children?.map(mutateStringLeaf((string, child) => {
    const [v, times] = string.split('*');
    if (times !== undefined) {
      const replaced = { sequential: Array(+times).fill(v), duration: +times }; // ...o, 
      return replaced;
    }
    return child;
  }))).map(simplify)).toEqual([
    ['hh', 0, 1],
    ['hh', 1, 1],
    ['hh', 2, 1],
    ['sn', 3, 1],
    ['sn', 4, 1],
  ])
});

test('chords without state', () => {
  expect(renderRhythmTree({
    duration: 4,
    sequential: ['C^7', ['Dm7', 'G7']]
  }).map(simplify)).toEqual([
    ['C^7', 0, 2],
    ['Dm7', 2, 1],
    ['G7', 3, 1],
  ]);

  // without lastVoicing
  expect(renderRhythmTree({
    duration: 4,
    sequential: ['C^7', ['Dm7', 'G7']]
  }, ({ children, node }) => {
    if (!node.chord) {
      return children?.map(mutateStringLeaf((chord) => ({ chord, parallel: Chord.get(chord).notes })))
    }
    return children;
  })
    .map(simplify)).toEqual([
      ['C', 0, 2],
      ['E', 0, 2],
      ['G', 0, 2],
      ['B', 0, 2],
      ['D', 2, 1],
      ['F', 2, 1],
      ['A', 2, 1],
      ['C', 2, 1],
      ['G', 3, 1],
      ['B', 3, 1],
      ['D', 3, 1],
      ['F', 3, 1],
    ]);
})

test('chords with mutable state', () => {
  const range = ['F3', 'A4'];
  let lastVoicing; // mutable state..
  expect(renderRhythmTree({
    duration: 4,
    sequential: ['C^7', ['Dm7', 'G7']]
  }, ({ children, node }) => {
    if (!!node.chord) {
      return children;
    }
    return children?.map(mutateStringLeaf((chord) => {
      lastVoicing = Voicing.get(chord, ['F3', 'A4'], lefthand, topNoteDiff, lastVoicing);
      return {
        chord,
        parallel: lastVoicing
      }
    }))
  }).map(simplify)).toEqual([
    ["B3", 0, 2,],
    ["D4", 0, 2,],
    ["E4", 0, 2,],
    ["G4", 0, 2,],
    ["C4", 2, 1,],
    ["E4", 2, 1,],
    ["F4", 2, 1,],
    ["A4", 2, 1,],
    ["B3", 3, 1,],
    ["E4", 3, 1,],
    ["F4", 3, 1,],
    ["A4", 3, 1,],
  ])
})

test('chords with immutable state', () => {
  // HOW TO PASS IMMUTABLE STATE IN AND OUT?
  /* const range = ['F3', 'A4'];
  expect(renderRhythmTree({
    duration: 4,
    sequential: ['C^7', ['Dm7', 'G7']]
  }, ({ children, node, state: { lastVoicing } }) => {
    if (!!node.chord) {
      return children;
    }
    return {
      children: children?.map(mutateStringLeaf((chord) => {
        lastVoicing = Voicing.get(chord, ['F3', 'A4'], lefthand, topNoteDiff, lastVoicing);
        return {
          chord,
          parallel: lastVoicing
        }
      })),
      lastVoicing
    };
  }).map(simplify)).toEqual([
    ["B3", 0, 2,],
    ["D4", 0, 2,],
    ["E4", 0, 2,],
    ["G4", 0, 2,],
    ["C4", 2, 1,],
    ["E4", 2, 1,],
    ["F4", 2, 1,],
    ["A4", 2, 1,],
    ["B3", 3, 1,],
    ["E4", 3, 1,],
    ["F4", 3, 1,],
    ["A4", 3, 1,],
  ]) */
})
