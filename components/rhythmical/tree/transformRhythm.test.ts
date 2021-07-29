import { RhythmObject, toRhythmObject } from '../util'
import { transformRhythm } from './transformRhythm'

test('transformRhythm', () => {
  expect(transformRhythm<string>(
    (node) => {
      if (typeof node !== 'string') {
        return node;
      }
      return node + 'x'
    },
    (node) => node,
    ['A', ['B', 'C'], 'D'])).toEqual(['Ax', ['Bx', 'Cx'], 'Dx'])

  expect(transformRhythm<string>(
    (node) => {
      if (!toRhythmObject(node).chords) {
        return node;
      }
      return {
        sequential: (node as RhythmObject<string>).chords
      }
    },
    (node) => node,
    {
      parallel: [
        ['melody', 'lalala'],
        { chords: ['C^7', ['Dm7', 'G7']] }
      ]
    })).toEqual(['Ax', ['Bx', 'Cx'], 'Dx'])
})