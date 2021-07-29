import { sequentialChild, sequentialParent } from './sequential'

describe('sequentialChild', () => {
  it('should apply syntax sugar', () => {
    expect(sequentialChild('A')).toEqual({
      value: 'A'
    })
    expect(sequentialChild({
      value: ['A']
    })).toEqual({
      value: ['A']
    })
    expect(sequentialChild(['A'])).toEqual({
      value: ['A']
    })
    expect(sequentialChild({ value: ['A'] })).toEqual({
      value: ['A']
    })
    expect(sequentialChild({ value: ['A'], type: 'sequential' })).toEqual({
      value: ['A'],
      type: 'sequential'
    })
    expect(sequentialChild({ sequential: ['A'] })).toEqual({
      value: ['A']
    })
  })
  it('should not change other types', () => {
    expect(sequentialChild({ value: ['A'], type: 'parallel' })).toEqual({
      value: ['A'],
      type: 'parallel'
    })
    expect(sequentialChild({ parallel: ['A'] })).toEqual({
      parallel: ['A']
    })
  })
})

describe('sequentialParent', () => {
  it('should add sequential paths', () => {
    expect(sequentialParent('A')).toEqual({ value: [{ path: [[0, 1, 1]], value: 'A' }] })
    expect(sequentialParent(['A'])).toEqual({ value: [{ path: [[0, 1, 1]], value: 'A' }] })
    expect(sequentialParent(['A', 'B'])).toEqual({ value: [{ path: [[0, 1, 2]], value: 'A' }, { path: [[1, 1, 2]], value: 'B' }] })
    expect(sequentialParent({ value: ['A', 'B'] })).toEqual({ value: [{ path: [[0, 1, 2]], value: 'A' }, { path: [[1, 1, 2]], value: 'B' }] })
    expect(sequentialParent({ sequential: ['A', 'B'] })).toEqual({ value: [{ path: [[0, 1, 2]], value: 'A' }, { path: [[1, 1, 2]], value: 'B' }] })
    expect(sequentialParent({ value: ['A', 'B'], type: 'sequential' })).toEqual({ type: 'sequential', value: [{ path: [[0, 1, 2]], value: 'A' }, { path: [[1, 1, 2]], value: 'B' }] })
    // expect(sequentialParent([{ parallel: ['A', 'B'] }])).toEqual({ value: [{ parallel: ['A', 'B'], path: [[0, 1, 1]] }] })
  })
})