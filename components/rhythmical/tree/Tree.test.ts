import { Chord } from '@tonaljs/tonal';
import { curry, __ } from 'ramda';
import { getRhythmChildren, makeRhythmParent, pathTimeDuration, rhythmFraction, toRhythmObject } from '../util';
import { Tree } from './Tree';
import { Voicing, VoiceLeading } from '../voicings/Voicing';
import { lefthand } from '../voicings/dictionary';
const { topNoteDiff } = VoiceLeading;

const getNestedArrayChildren = (node) => Array.isArray(node) ? node : [];
const countLeaves = Tree.reduce(__, (total, node) => typeof node === 'string' ? total + 1 : total, 0);
const flattenLeaves = Tree.reduce(__, (flat, node) => typeof node === 'string' ? flat.concat([node]) : flat, []);

const simplify = ({ value, time, duration }) => [value, time, duration];

test('Tree.reduce', () => {
  expect(countLeaves(getNestedArrayChildren, ['A', ['B', 'C'], 'D'])).toEqual(4);
  expect(flattenLeaves(getNestedArrayChildren, ['A', ['B', 'C'], 'D'])).toEqual(['A', 'B', 'C', 'D']);
});

test('Tree.map', () => {
  const makeNestedArrayParent = (_, children) => children;

  const mapNestedArray = Tree.map(getNestedArrayChildren, makeNestedArrayParent);

  const addExclamationMarks = mapNestedArray((node) => Array.isArray(node) ? node : node + '!');

  expect(addExclamationMarks(['A', ['B', 'C'], 'D'])).toEqual(['A!', ['B!', 'C!'], 'D!']);

  expect(mapNestedArray(
    (node) => {
      if (node === 'A') {
        return ['X', 'Y']
      }
      return Array.isArray(node) ? node : node + '!';
    },
    ['A', ['B', 'C'], 'D']))
    .toEqual([['X!', 'Y!'], ['B!', 'C!'], 'D!']);
});

test('rhythmEvents', () => {
  const rhythmEvents = Tree.reduce(
    function getRhythmNodes({ node: parent, path }) {
      // resolve children + pass down parent and sibling info + path
      return getRhythmChildren(parent)
        ?.map((node, index, siblings) => ({
          node,
          index,
          siblings,
          parent,
          path: path.concat([rhythmFraction(node, index, siblings, parent)])
        }))
    },
    function eventReducer(state, current) {
      const { node, parent, path } = current;
      const children = getRhythmChildren(node);
      if (!parent || !!children?.length) {
        return state;
      }
      const { events } = state
      return { ...state, events: events.concat({ ...toRhythmObject(node), ...pathTimeDuration(path, 3) }) };
    }, { events: [] });

  expect(rhythmEvents({ node: ['A', ['B', 'C'], 'D'], path: [] }).events.map(simplify)).toEqual([
    ['A', 0, 1],
    ['B', 1, 0.5],
    ['C', 1.5, 0.5],
    ['D', 2, 1],
  ]);
})


function getRhythmNodes({ node: parent }) {
  // resolve children + pass down parent and sibling info + path
  return getRhythmChildren(parent)?.map((node, index, siblings) => ({
    node,
    index,
    siblings,
    parent
  }))
}

function makeRhythmNodeParent(current, children) {
  const newParent = makeRhythmParent(current.node, children.map((child) => child.node));
  return { ...current, node: newParent };
};

const mapRhythm = curry(function (mapFn, node) {
  return Tree.map(getRhythmNodes, makeRhythmNodeParent, mapFn, { node }).node;
})


test('mapChords', () => {
  const mapChords = mapRhythm((current) => {
    const { node, parent } = current;
    if (typeof node !== 'string' || !!parent.chord) {
      return current;
    }
    const { notes } = Chord.get(node)
    return { ...current, node: { parallel: notes, chord: node } }
  });


  expect(mapChords(['C', ['F', 'G']])).toEqual([
    { parallel: ['C', 'E', 'G'], chord: 'C' },
    [
      { parallel: ['F', 'A', 'C'], chord: 'F' },
      { parallel: ['G', 'B', 'D'], chord: 'G' },
    ]
  ])

})

test('mapVoicings', () => {

  const mapVoicings = (r) => {
    let lastVoicing;
    return mapRhythm((current) => {
      const { node, parent } = current;
      if (typeof node !== 'string' || !!parent.chord) {
        return current;
      }
      // impurity alert.. but everything else would be a total brainfuck..
      lastVoicing = Voicing.get(node, ['F3', 'A4'], lefthand, topNoteDiff, lastVoicing);
      return { ...current, node: { parallel: lastVoicing, chord: node } }
    }, r)
  }

  expect(mapVoicings(['C^7', ['Dm7', 'G7']])).toEqual([
    { parallel: ['B3', 'D4', 'E4', 'G4'], chord: 'C^7' },
    [
      { parallel: ['C4', 'E4', 'F4', 'A4'], chord: 'Dm7' },
      { parallel: ['B3', 'E4', 'F4', 'A4'], chord: 'G7' },
    ]
  ])
});


test('mapVoicings immutable', () => {

})