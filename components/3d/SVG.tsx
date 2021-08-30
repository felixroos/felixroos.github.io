import * as math from 'mathjs';
import { curry } from 'ramda';

export default function SVG(props) {
  const { children, ...rest } = props;
  return <svg {...rest}>{children}</svg>;
}

export const cubeLines = [
  // front
  [
    [-1, 1, -1],
    [1, 1, -1],
  ],
  [
    [-1, -1, -1],
    [1, -1, -1],
  ],
  [
    [-1, 1, -1],
    [-1, -1, -1],
  ],
  [
    [1, 1, -1],
    [1, -1, -1],
  ],
  // back
  [
    [-1, 1, 1],
    [1, 1, 1],
  ],
  [
    [-1, -1, 1],
    [1, -1, 1],
  ],
  [
    [-1, 1, 1],
    [-1, -1, 1],
  ],
  [
    [1, 1, 1],
    [1, -1, 1],
  ],
  // connect
  [
    [-1, 1, -1],
    [-1, 1, 1],
  ],
  [
    [1, 1, -1],
    [1, 1, 1],
  ],
  [
    [-1, -1, -1],
    [-1, -1, 1],
  ],
  [
    [1, -1, -1],
    [1, -1, 1],
  ],
].map((endPoints) => endPoints.map((endPoint) => endPoint.map((p) => p * 100)));

export const projection = [
  [1, 0, 0],
  [0, 1, 0],
];

export const rotateX = (angle) => [
  [1, 0, 0],
  [0, Math.cos(angle), -Math.sin(angle)],
  [0, Math.sin(angle), Math.cos(angle)],
];
export const rotateY = (angle) => [
  [Math.cos(angle), 0, Math.sin(angle)],
  [0, 1, 0],
  [-Math.sin(angle), 0, Math.cos(angle)],
];
export const rotateZ = (angle) => [
  [Math.cos(angle), -Math.sin(angle), 0],
  [Math.sin(angle), Math.cos(angle), 0],
  [0, 0, 1],
];

export const cubeLines2d = cubeLines.map(([p1, p2]) =>
  [p1, p2].map((p) =>
    math.multiply(
      projection,
      p.map((v) => v * 100)
    )
  )
);

export const rotate3d = curry((rotate, point) => {
  const [rx, ry, rz] = rotate;
  return math
    .chain(point)
    .multiply(rotateX((rx / 180) * Math.PI))
    .multiply(rotateY((ry / 180) * Math.PI))
    .multiply(rotateZ((rz / 180) * Math.PI))
    .done();
});

export const offset3d = curry((offset: number[], point: number[]) => point.map((v, i) => v + offset[i]));
export const scale3d = curry((scale: number, point: number[]) => point.map((v) => v * scale));

export const project3d = (point) => {
  const projection = [
    [1, 0, 0],
    [0, 1, 0],
  ];
  return math.multiply(
    projection,
    point.map((v) => Math.round(v * 1000) / 1000)
  );
};
