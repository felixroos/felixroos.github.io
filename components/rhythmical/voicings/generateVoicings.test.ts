import { lefthandVoicings } from './generateVoicings'

test('generateVoicings', () => {
  expect(lefthandVoicings(['C^7', ['Dm7', 'G7']])).toEqual([
    {
      chord: "C^7",
      parallel: [
        "E3",
        "G3",
        "B3",
        "D4",
      ],
    },
    [
      {
        chord: "Dm7",
        parallel: [
          "F3",
          "A3",
          "C4",
          "E4",
        ],
      },
      {
        chord: "G7",
        parallel: [
          "F3",
          "A3",
          "B3",
          "E4",
        ],
      },
    ],
  ]);
  expect(lefthandVoicings({ sequential: ['C^7', ['Dm7', 'G7']] })).toEqual({
    sequential: [
      {
        chord: "C^7",
        parallel: [
          "E3",
          "G3",
          "B3",
          "D4",
        ],
      },
      [
        {
          chord: "Dm7",
          parallel: [
            "F3",
            "A3",
            "C4",
            "E4",
          ],
        },
        {
          chord: "G7",
          parallel: [
            "F3",
            "A3",
            "B3",
            "E4",
          ],
        },
      ],
    ]
  })
})