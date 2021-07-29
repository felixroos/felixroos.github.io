import { getRhythmChildren, makeRhythmParent, RhythmNode } from '../util'
import { fromAST, rhythmAST, toAST } from './rhythmAST'

test('rhythmAST', () => {
  expect(rhythmAST(['C', ['D', 'E'], 'F'])).toEqual({
    sequential: [
      { value: 'C' },
      {
        sequential: [
          { value: 'D' },
          { value: 'E' }
        ]
      },
      { value: 'F' }
    ]
  })
})

test('toAST', () => {
  expect(toAST<RhythmNode<string>>(
    getRhythmChildren,
    (data, type, children) => ({
      data,
      type,
      ...(children ? { children } : {})
    }),
    ['C', ['D', 'E'], 'F'],
  )).toEqual({
    children: [
      { data: "C", type: "literal" },
      {
        children: [
          { data: "D", type: "literal" },
          { data: "E", type: "literal" }
        ],
        data: ["D", "E"],
        type: "array"
      }, { data: "F", type: "literal" }
    ],
    data: ["C", ["D", "E"], "F"],
    type: "array"
  });
})
test('fromAST', () => {
  expect(fromAST<RhythmNode<string>>(
    makeRhythmParent,
    {
      children: [
        { data: "C", type: "literal" },
        {
          children: [
            { data: "D", type: "literal" },
            { data: "E", type: "literal" }
          ],
          data: ["D", "E"],
          type: "array"
        }, { data: "F", type: "literal" }
      ],
      data: ["C", ["D", "E"], "F"],
      type: "array"
    })).toEqual(['C', ['D', 'E'], 'F']);
})
test('transformRhythm', () => {
  expect(fromAST<RhythmNode<string>>(
    makeRhythmParent,
    {
      children: [
        { data: "C", type: "literal" },
        {
          children: [
            { data: "D", type: "literal" },
            { data: "E", type: "literal" }
          ],
          data: ["D", "E"],
          type: "array"
        }, { data: "F", type: "literal" }
      ],
      data: ["C", ["D", "E"], "F"],
      type: "array"
    })).toEqual(['C', ['D', 'E'], 'F']);
})