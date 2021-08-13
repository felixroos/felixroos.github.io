import buildTree from './buildTree'

test('buildTree', () => {
  const step1 = [
    {
      path: ['D aeolian'],
      value: 0,
      values: [0]
    },
    {
      path: ['D dorian'],
      value: 0,
      values: [0]
    },
  ]
  expect(buildTree(step1)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '1.0:D dorian', label: 'D dorian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian', label: '0' },
      { source: '0', target: '1.0:D dorian', label: '0' },
    ]
  });


  const step2 = [
    {
      path: ["D aeolian", "G mixolydian"],
      value: 2,
      values: [0, 2],
    }
    , step1[1]]

  expect(buildTree(step2)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian', label: '0' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian', label: '+2=2' },
      { source: '0', target: '1.0:D dorian', label: '0' },
    ]
  })

  const step3 = [
    step2[0],
    {
      path: ["D dorian", "G mixolydian"],
      value: 0,
      values: [0, 0],
    }];

  expect(buildTree(step3)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
      { id: '1.1:G mixolydian', label: 'G mixolydian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian', label: '0' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian', label: '+2=2' },
      { source: '0', target: '1.0:D dorian', label: '0' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian', label: '+0=0' },
    ]
  })

  const step4 = [
    step2[0], {
      path: ["D dorian", "G mixolydian", "C major"],
      value: 0,
      values: [0, 0, 0],
    },
    {
      path: ["D dorian", "G mixolydian", "C lydian"],
      value: 2,
      values: [0, 0, 2],
    }];

  expect(buildTree(step4)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
      { id: '1.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.2:C major', label: 'C major' },
      { id: '2.2:C lydian', label: 'C lydian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian', label: '0' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian', label: '+2=2' },
      { source: '0', target: '1.0:D dorian', label: '0' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian', label: '+0' },
      { source: '1.1:G mixolydian', target: '1.2:C major', label: '+0=0' },
      { source: '0', target: '1.0:D dorian', label: '0' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian', label: '+0' },
      { source: '1.1:G mixolydian', target: '2.2:C lydian', label: '+2=2' },
    ]
  })
})
