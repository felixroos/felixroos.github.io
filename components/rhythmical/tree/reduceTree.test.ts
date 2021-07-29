import { EventAccumulator, eventBroker, eventReducer, flatz, reduceTree } from './reduceTree';

test('reduceTree', () => {
  const tree = {
    duration: 9,
    children: [
      { data: 'C69' },
      {
        children: [
          { data: 'D-7' },
          { data: 'G7' },
          { children: [{ data: 'C7' }, { data: 'Gb7' }] }
        ]
      },
      { data: 'F^7' }
    ]
  };
  const expectedEvents = [
    { value: 'C69', path: [[0, 9, 1], [0, 1, 3]] },
    { value: 'D-7', path: [[0, 9, 1], [1, 1, 3], [0, 1, 3]] },
    { value: 'G7', path: [[0, 9, 1], [1, 1, 3], [1, 1, 3]] },
    { value: 'C7', path: [[0, 9, 1], [1, 1, 3], [2, 1, 3], [0, 1, 2]] },
    { value: 'Gb7', path: [[0, 9, 1], [1, 1, 3], [2, 1, 3], [1, 1, 2]] },
    { value: 'F^7', path: [[0, 9, 1], [2, 1, 3]] }
  ];
  const res1 =
    reduceTree<string, EventAccumulator<string>>(
      eventReducer,
      eventBroker,
      { events: [] },
      tree
    );
  expect(res1.events).toEqual(expectedEvents)
  // expect(res1.path).toEqual(undefined)
  expect(res1.parents.length).toEqual(1)
  expect(res1.parents[0]).toEqual(tree)

  expect(flatz(tree)).toEqual([
    { value: 'C69', time: 0, duration: 3 },
    { value: 'D-7', time: 3, duration: 1 },
    { value: 'G7', time: 4, duration: 1 },
    { value: 'C7', time: 5, duration: 0.5 },
    { value: 'Gb7', time: 5.5, duration: 0.5 },
    { value: 'F^7', time: 6, duration: 3 },
  ])
})



// curry test...

/* declare type GenericTreeReducer<T, A> = (
  reducer: TreeReducer<T, A>,
  broker: TreeBroker<T, A>,
  accumulator: A,
  tree: StandardTree<T>
) => A
function curryTree<T, A>() {
  return curry<GenericTreeReducer<T, A>>(reduceTree)
}; */
// how to declare this with a const arrow function ?!
// how to directly return the curried function => this needs an empty call...

// this does not work yet..
/* const treeEvents = curryTree<string, EventAccumulator<string>>()(
  ({ events, ...acc }, node) => {
    const { parents, path } = pathReducer(acc, node);
    if (node.children) {
      events = events.concat([{ value: node.data, path }]);
    }
    return {
      events,
      parents, path
    }
  },
  ({ events }, old) => ({ ...old, events }),
  { events: [] }
);


test('treeEvents (curry)', () => {
  const tree = {
    children: [
      { data: 'C69' },
      {
        children: [
          { data: 'D-7' },
          { data: 'G7' },
          { children: [{ data: 'C7' }, { data: 'Gb7' }] }
        ]
      },
      { data: 'F^7' }
    ]
  }
  const expectedEvents = [
    { value: 'C69', path: [0] },
    { value: 'D-7', path: [1, 0] },
    { value: 'G7', path: [1, 1] },
    { value: 'C7', path: [1, 2, 0] },
    { value: 'Gb7', path: [1, 2, 1] },
    { value: 'F^7', path: [2] }
  ];
  // expect(treeEvents(tree).events).toEqual(expectedEvents)
}) */

// find out why the above returns unknown...
// read https://medium.com/free-code-camp/typescript-curry-ramda-types-f747e99744ab ...

// TODO: find out how to nest reducers:
// pipe(pathReducer, eventReducer)(acc) ?!
/* const eventBroker: TreeBroker<any, EventAccumulator<any>> = (now, before, node) => {
  // key insight: ignore parents / path of now
  // this prevents nested information to bubble from child to child
  return { ...before, events: now.events }
}; */
