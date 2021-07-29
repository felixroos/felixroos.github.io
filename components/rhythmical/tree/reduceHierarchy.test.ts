import { plug, reduceHierarchy } from './reduceHierarchy'

test('plug', () => {
  const fused = plug<object>(
    (s) => ({ ...s, bar: true }),
    (s, p) => ({ ...s, foo: true, ...p }),
  )
  expect(fused({ x: 1 })).toEqual({
    x: 1, foo: true, bar: true
  });
  expect(fused({ x: 1 }, { y: 0 })).toEqual({
    x: 1, foo: true, bar: true, y: 0
  });

})


declare type WithCount = { count?: number };
function countNodes({ count = 0, ...s }: WithCount & any) {
  return { ...s, count: count + 1 }
};

declare type WithNodes = { nodes: any[] } & any;
const flattenNodes = [
  (c, p) => {
    return { ...c, nodes: p?.nodes.concat(([c])) || [] }
  },
  ({ nodes, ...c }) => ({ ...c, nodes })
]

declare type SimpleTreeState = {
  tree: any[] | string,
  // nodes?: SimpleTreeState[];
};


test('reduceHierarchy', () => {
  const { count, nodes } = reduceHierarchy<SimpleTreeState & WithCount & WithNodes>(
    ({ tree, ...s }) => Array.isArray(tree) ? tree.map(child => ({ tree: child, ...s })) : undefined,
    plug(countNodes, flattenNodes[0]),
    flattenNodes[1],
    {
      tree: ['A', ['B', 'C']],
    }
  )
  expect(count).toEqual(3);
  expect(nodes.map(({ tree }) => tree)).toEqual(
    [
      "A",
      [
        "B",
        "C",
      ],
      "B",
      "C",
    ]
  );
})

test('reduce', () => {
  const plugins = [
    [({ level = 0, ...s }) => ({ ...s, level: level + 1 }), ({ nodes, ...s }) => ({ ...s, nodes: nodes + 1 })]
  ]
})