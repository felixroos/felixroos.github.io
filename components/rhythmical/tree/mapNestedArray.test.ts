import { mapNestedArray } from './mapNestedArray'

test('mapNestedArray', () => {
  expect(mapNestedArray(['A', ['B', 'C']], (node) => {
    if (Array.isArray(node)) {
      return node;
    }
    return node + '!';
  })).toEqual(['A!', ['B!', 'C!']])
})