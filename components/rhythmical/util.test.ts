import { pathTimeDuration } from './util'

test('pathTimeDuration', () => {
  expect(pathTimeDuration([[0, 1, 2], [1, 1, 2]], 2)).toEqual({
    time: 0.5,
    duration: 0.5
  });
})