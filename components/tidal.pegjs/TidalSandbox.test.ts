import Pattern from 'tidal.pegjs/dist/pattern.js';
console.log(Pattern)

test('tidal.pegjs', () => {
  const values = (e) => e.value;

  const pattern = Pattern('[A <B C>]')
  expect(pattern.query(0, 1).map(values)).toEqual(['A', 'B']);
  expect(pattern.query(1, 1).map(values)).toEqual(['A', 'C']);
  const pattern2 = Pattern('[A <B C>]')
  expect(pattern2.query(1, 1).map(values)).toEqual(['A', 'C']);
})