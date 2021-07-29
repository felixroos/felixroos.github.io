import { pathTimeDuration, pathTimeDurationSimple } from '../util';
import { visit } from './visit';

test('visit', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);

  const tree = ['A', ['B', 'C'], 'D'];
  const walker = nestedWalker(tree);

  /* for (let { node, isBefore } of nestedWalker(tree)) {
    console.log(node, isBefore);
  } */

  expect(walker.next().value.node).toEqual(['A', ['B', 'C'], 'D']);
  expect(walker.next().value.node).toEqual('A');
  expect(walker.next().value.node).toEqual('A');
  expect(walker.next().value.node).toEqual(['B', 'C']);
  expect(walker.next().value.node).toEqual('B');
  expect(walker.next().value.node).toEqual('B');
  expect(walker.next().value.node).toEqual('C');
  expect(walker.next().value.node).toEqual('C');
  expect(walker.next().value.node).toEqual(['B', 'C']);
  expect(walker.next().value.node).toEqual('D');
  expect(walker.next().value.node).toEqual('D');
  expect(walker.next().value.node).toEqual(['A', ['B', 'C'], 'D']);
  expect(walker.next().value).toEqual(undefined);

  const path = [];
  const events = [];

  for (let { index, isBefore, isLeaf, isRoot } of nestedWalker(tree)) {
    if (isBefore) {
      !isRoot && path.push(index);
      isLeaf && events.push([...path]);
    } else {
      !isRoot && path.pop();
    }
  }
  expect(events).toEqual([[0], [1, 0], [1, 1], [2]]);
})

test('visit branches', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);

  const tree = ['A', ['B', 'C'], 'D'];

  const branches = [];
  const events = [];

  for (let { isBefore, isLeaf, children } of nestedWalker(tree)) {
    if (isBefore) {
      branches.push(children.length);
      isLeaf && events.push([...branches]);
    } else {
      branches.pop();
    }
  }
  expect(events).toEqual([[3, 0], [3, 2, 0], [3, 2, 0], [3, 0]]);
});

test('visit branches', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);

  function getDivisions(tree) {
    let division = 1;
    const events = [];

    for (let { isBefore, isLeaf, siblings } of nestedWalker(tree)) {
      if (isBefore) {
        division *= siblings?.length || 1;
        isLeaf && events.push(division);
      } else {
        division /= (siblings?.length || 1);
      }
    }
    return events;
  }
  expect(getDivisions(['A', ['B', 'C'], 'D'])).toEqual([3, 6, 6, 3]);

  expect(getDivisions([
    [
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', 'sn'],
    ],
    [
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', ['sn', 'sn', 'sn']],
      [
        ['sn', 'sn', 'sn'],
        ['sn', 'sn', 'sn'],
      ],
    ],
  ])).toEqual([
    12, 36, 36, 36, 12, 36, 36, 36, 12, 12, 12, 36, 36, 36, 12, 36, 36, 36, 36, 36, 36, 36, 36, 36
  ])
})

test('visit paths', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);

  function divisionPaths(tree) {
    const path = [];
    const events = [];
    for (let { node, index, isBefore, isLeaf, siblings } of nestedWalker(tree)) {
      if (isBefore) {
        siblings && path.push([index, siblings.length]);
        isLeaf && events.push({ node, path: [...path] });
      } else {
        siblings && path.pop();
      }
    }
    return events;
  }

  expect(divisionPaths(['A', ['B', 'C'], 'D']).map((event) => ({ ...event, path: event.path.join(' ') }))).toEqual([
    { node: 'A', path: '0,3' },
    { node: 'B', path: '1,3 0,2' },
    { node: 'C', path: '1,3 1,2' },
    { node: 'D', path: '2,3' },
  ]);


  const renderEvents = (tree, duration) => divisionPaths(tree)
    .map(({ node, path }) => ({ node, ...pathTimeDurationSimple(path, duration) }));

  expect(renderEvents(['A', ['B', 'C'], 'D'], 6)).toEqual([
    { node: 'A', time: 0, duration: 2 },
    { node: 'B', time: 2, duration: 1 },
    { node: 'C', time: 3, duration: 1 },
    { node: 'D', time: 4, duration: 2 },
  ]);

})

function timeDurationPaths(walker, getDuration) {
  const path = [];
  const events = [];
  for (let { node, index, isBefore, isRoot, isLeaf, siblings } of walker) {
    if (!isRoot && isBefore) {
      siblings = siblings || [];
      const sumDurations = (nodes) => nodes.reduce((sum, current) => sum + getDuration(current), 0);
      const time = sumDurations(siblings.slice(0, index));
      const duration = getDuration(node);
      const total = time + sumDurations(siblings.slice(index));
      path.push([time, duration, total]);
      isLeaf && events.push({ node, path: [...path] });
    } else if (!isRoot) {
      path.pop();
    }
  }
  return events;
}

// see rhythmical-trees post
test('visit variable duration', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);
  expect(timeDurationPaths(nestedWalker(['A', ['B', 'C'], 'D']), () => 1)
    .map((event) => ({ ...event, path: event.path.join(' ') }))).toEqual([
      { node: 'A', path: '0,1,3' },
      { node: 'B', path: '1,1,3 0,1,2' },
      { node: 'C', path: '1,1,3 1,1,2' },
      { node: 'D', path: '2,1,3' },
    ]);


  const renderEvents = (tree, duration, getDuration = (_) => 1) => timeDurationPaths(nestedWalker(tree), getDuration)
    .map(({ node, path }) => ({ node, ...pathTimeDuration(path, duration) }));

  expect(renderEvents(['A', ['B', 'C'], 'D'], 6)).toEqual([
    { node: 'A', time: 0, duration: 2 },
    { node: 'B', time: 2, duration: 1 },
    { node: 'C', time: 3, duration: 1 },
    { node: 'D', time: 4, duration: 2 },
  ]);

  expect(renderEvents([
    ["C4*3", "D4"],
    ["E4", "D4*2", "B3"]
  ], 8, ((node) => typeof node === 'string' ? +node.split('*')[1] || 1 : 1))).toEqual([
    { node: 'C4*3', time: 0, duration: 3 },
    { node: 'D4', time: 3, duration: 1 },
    { node: 'E4', time: 4, duration: 1 },
    { node: 'D4*2', time: 5, duration: 2 },
    { node: 'B3', time: 7, duration: 1 },
  ]);

})

test('bolero', () => {
  const nestedWalker = (tree) => visit((node) => Array.isArray(node) && node, tree);
  const renderEvents = (tree, duration, getDuration = (_) => 1) => timeDurationPaths(nestedWalker(tree), getDuration)
    .map(({ node, path }) => ({ node, ...pathTimeDuration(path, duration) })).map(({ node, time, duration }) => [node, time, duration]);

  expect(renderEvents([
    [
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', 'sn'],
    ],
    [
      ['sn', ['sn', 'sn', 'sn']],
      ['sn', ['sn', 'sn', 'sn']],
      [
        ['sn', 'sn', 'sn'],
        ['sn', 'sn', 'sn'],
      ],
    ],
  ], 9)).toEqual([
    ["sn", 0, 0.75],
    ["sn", 0.75, 0.25],
    ["sn", 1, 0.25],
    ["sn", 1.25, 0.25],
    ["sn", 1.5, 0.75],
    ["sn", 2.25, 0.25],
    ["sn", 2.5, 0.25],
    ["sn", 2.75, 0.25],
    ["sn", 3, 0.75],
    ["sn", 3.75, 0.75],
    ["sn", 4.5, 0.75],
    ["sn", 5.25, 0.25],
    ["sn", 5.5, 0.25],
    ["sn", 5.75, 0.25],
    ["sn", 6, 0.75],
    ["sn", 6.75, 0.25],
    ["sn", 7, 0.25],
    ["sn", 7.25, 0.25],
    ["sn", 7.5, 0.25],
    ["sn", 7.75, 0.25],
    ["sn", 8, 0.25],
    ["sn", 8.25, 0.25],
    ["sn", 8.5, 0.25],
    ["sn", 8.75, 0.25]
  ])
})
