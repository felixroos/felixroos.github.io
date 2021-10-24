import * as math from 'mathjs'
import { project3d, rotateY } from '../3d/SVG';

test('cube', () => {
  const cube = [
    [-1, 1, -1],
    [1, 1, -1],
    [-1, -1, -1],
    [1, -1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];

  const projection = [[1, 0, 0], [0, 1, 0]];

  const projectedCube = cube.map(point => math.multiply(projection, point))
  // expect(projectedCube).toEqual([])

  const cubeLines = [
    // front
    [[-1, 1, -1], [1, 1, -1]],
    [[-1, -1, -1], [1, -1, -1]],
    [[-1, 1, -1], [-1, -1, -1]],
    [[1, 1, -1], [1, -1, -1]],
    // back
    [[-1, 1, 1], [1, 1, 1]],
    [[-1, -1, -1], [1, -1, 1]],
    [[-1, 1, 1], [-1, -1, 1]],
    [[1, 1, 1], [1, -1, 1]],
    // connect
    [[-1, 1, -1], [-1, 1, 1]],
    [[1, 1, -1], [1, 1, 1]],
    [[-1, -1, -1], [-1, -1, 1]],
    [[1, -1, -1], [1, -1, 1]],
    [[1, 1, -1], [1, 1, 1]]
  ];

  const cubeLinesScaled = cubeLines.map((line) =>
    line.map((p) => p.map((v) => v * 100)
    )
  );

  // expect(math.chain([1, 1, 1]).multiply(rotateY(Math.PI)).done()).toEqual([])

  const cubeLines2d = cubeLinesScaled.map((line) => // [[-1, 1, -1], [1, 1, -1]]
    line.map(point => // [-1, 1, -1]
      math.multiply(projection, point))
  );
  // expect(cubeLines2d).toEqual([])
})

test('project3d', () => {
  expect(project3d([1, 1, 1])).toEqual([1, 1])
  // expect(project3d([1, 1, 1], [45, 45, 90])).toEqual([1, 1])
})