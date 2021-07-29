import { parallelChild, parallelParent } from './parallel'

describe('parallelChild', () => {
  it('should not modify other typed children', () => {
    expect(parallelChild('A')).toEqual('A')
    expect(parallelChild(['A'])).toEqual(['A'])
    expect(parallelChild({ value: ['A'] })).toEqual({ value: ['A'] })
    expect(parallelChild({ value: ['A'], type: 'sequential' })).toEqual({
      value: ['A'],
      type: 'sequential'
    })
    expect(parallelChild({ sequential: ['A'] })).toEqual({
      sequential: ['A']
    })
  })
  it('should apply syntax sugar', () => {
    expect(parallelChild({ value: ['A'], type: 'parallel' })).toEqual({
      value: ['A'],
      type: 'parallel'
    })
    expect(parallelChild({ parallel: ['A'] })).toEqual({
      value: ['A'],
      type: 'parallel'
    })
    expect((parallelChild({ parallel: ['A', 'B'] }))).toEqual({ value: ['A', 'B'], type: 'parallel' })
  })
})

describe('parallelParent', () => {
  it('should not modify other types', () => {
    expect(parallelParent('A')).toEqual('A')
    expect(parallelParent(['A'])).toEqual(['A'])
    expect(parallelParent({ value: ['A'] })).toEqual({ value: ['A'] })
    expect(parallelParent({ value: ['A'], type: 'sequential' })).toEqual({ value: ['A'], type: 'sequential' })
  })
  /* it('should add parallel paths to children', () => {
    expect(parallelParent({ value: ['A'], type: 'parallel' })).toEqual({ value: [{ value: 'A', path: [[0, 1, 1]] }], type: 'parallel' })
    expect(parallelParent({ value: ['A', 'B'], type: 'parallel' })).toEqual({ value: [{ value: 'A', path: [[0, 1, 1]] }, { value: 'B', path: [[0, 1, 1]] }], type: 'parallel' })
    expect(parallelParent({ value: ['A', 'B'], type: 'parallel', duration: 2 })).toEqual({ value: [{ value: 'A', path: [[0, 2, 1]] }, { value: 'B', path: [[0, 2, 1]] }], type: 'parallel', duration: 2 })
    expect(parallelParent({ parallel: ['A', 'B'] })).toEqual({ value: [{ value: 'A', path: [[0, 1, 1]] }, { value: 'B', path: [[0, 1, 1]] }], type: 'parallel' })
  }) */
})

